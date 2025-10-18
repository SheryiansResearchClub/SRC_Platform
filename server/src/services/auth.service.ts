import type { UserDocument, GoogleProfileType, TokenPair } from '@/types';
import { userRepo } from '@/repositories/user.repository';
import { jwtService } from '@/lib/auth/jwt';
import { UnauthorizedError, ValidationError, ConflictError } from '@/utils/errors';
import { emailService } from '@/services/email.service';
import { logger } from '@/utils/logger';
import crypto from 'crypto';
import dayjs from 'dayjs';
import oAuthClient from '@/integrations';

class AuthService {
  private userRepo = userRepo;

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: UserDocument; tokens: TokenPair }> {
    const emailExists = await this.userRepo.emailExists(data.email);
    if (emailExists) {
      throw new ConflictError('Email already registered');
    }

    if (data.password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    const user = await this.userRepo.create({
      name: data.name,
      email: data.email,
      password: data.password,
      oauthProvider: 'email',
      role: 'member'
    });

    await this.sendVerificationEmail(user._id.toString(), user.email, user.name);
    void emailService
      .sendWelcomeEmail(user.email, user.name, user._id.toString())
      .catch((error) => {
        logger.error('Failed to send welcome email', {
          userId: user._id.toString(),
          email: user.email,
          error,
        });
      });

    const tokens = await this.generateTokens(user);

    return { user, tokens };
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: UserDocument; tokens: TokenPair }> {
    const user = await this.userRepo.findByEmailWithPassword(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Account is suspended or inactive');
    }

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }


    await this.userRepo.updateLastLogin(user._id.toString());
    const tokens = await this.generateTokens(user);

    return { user, tokens };
  }

  async googleOAuthCallback(
    profile: GoogleProfileType
  ): Promise<TokenPair> {
    let user: UserDocument | null = await this.userRepo.findByOAuthId(profile._id.toString(), 'google');
    if (user) {
      return this.generateTokens(user);
    }
    return this.generateTokens({ _id: profile._id, email: profile.email, role: 'member', oauthProvider: 'google' } as UserDocument);
  }

  async discordOAuthCallback(code: string): Promise<{ user: UserDocument; tokens: TokenPair; isNewUser: boolean }> {
    const tokenData = await oAuthClient.discordTokenClient(code);

    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: tokenType,
      expires_in: expiresIn,
      scope
    } = tokenData ?? {};

    const discordProfile = await oAuthClient.discordUserClient(accessToken, refreshToken, expiresIn, scope, tokenType);

    let user = await this.userRepo.findByDiscordId(discordProfile.id);
    let isNewUser = false;

    const expiresAt = dayjs().add(discordProfile.expiresIn, 'seconds').toDate();

    if (!user) {
      user = await this.userRepo.findByEmail(discordProfile.email);

      if (user) {
        const isDiscordTaken = await this.userRepo.isDiscordIdTaken(
          discordProfile.id,
          user._id.toString()
        );

        if (isDiscordTaken) {
          throw new ConflictError('This Discord account is already linked to another user');
        }

        user = await this.userRepo.connectDiscord(user._id.toString(), {
          id: discordProfile.id,
          username: discordProfile.username,
          discriminator: discordProfile.discriminator,
          avatar: discordProfile.avatar,
          accessToken: discordProfile.accessToken,
          refreshToken: discordProfile.refreshToken,
          expiresAt,
          scopes: discordProfile.scopes
        });
      } else {
        const avatarUrl = discordProfile.avatar
          ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
          : undefined;

        user = await this.userRepo.create({
          name: discordProfile.username,
          email: discordProfile.email,
          oauthProvider: 'discord',
          oauthId: discordProfile.id,
          avatarUrl,
          role: 'member',
          discord: {
            id: discordProfile.id,
            username: discordProfile.username,
            discriminator: discordProfile.discriminator,
            avatar: discordProfile.avatar,
            accessToken: discordProfile.accessToken,
            refreshToken: discordProfile.refreshToken,
            expiresAt,
            scopes: discordProfile.scopes
          }
        });

        await this.userRepo.update(user._id.toString(), {
          isEmailVerified: true
        } as Partial<UserDocument>);

        isNewUser = true;
      }
    } else {
      await this.userRepo.updateDiscordTokens(
        user._id.toString(),
        discordProfile.accessToken,
        discordProfile.refreshToken,
        expiresAt
      );
    }

    await this.userRepo.updateLastLogin(user!._id.toString());

    const tokens = await this.generateTokens(user!);

    return { user: user!, tokens, isNewUser };
  }

  async connectDiscordAccount(
    userId: string,
    discordProfile: {
      id: string;
      username: string;
      discriminator: string;
      avatar?: string;
      accessToken: string;
      refreshToken?: string;
      expiresIn: number;
      scopes: string[];
    }
  ): Promise<UserDocument> {
    const isDiscordTaken = await this.userRepo.isDiscordIdTaken(
      discordProfile.id,
      userId
    );

    if (isDiscordTaken) {
      throw new ConflictError('This Discord account is already linked to another user');
    }

    const expiresAt = dayjs().add(discordProfile.expiresIn, 'seconds').toDate();

    const user = await this.userRepo.connectDiscord(userId, {
      id: discordProfile.id,
      username: discordProfile.username,
      discriminator: discordProfile.discriminator,
      avatar: discordProfile.avatar,
      accessToken: discordProfile.accessToken,
      refreshToken: discordProfile.refreshToken,
      expiresAt,
      scopes: discordProfile.scopes
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }

  async disconnectDiscordAccount(userId: string): Promise<UserDocument> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (user.oauthProvider === 'discord' && !user.password) {
      throw new ConflictError(
        'Cannot disconnect Discord as it is your only login method. Please set a password first.'
      );
    }

    const updatedUser = await this.userRepo.disconnectDiscord(userId);

    if (!updatedUser) {
      throw new UnauthorizedError('Failed to disconnect Discord');
    }

    return updatedUser;
  }

  async refreshDiscordToken(userId: string): Promise<UserDocument> {
    const user = await this.userRepo.findByDiscordIdWithTokens(userId);

    if (!user || !user.discord?.refreshToken) {
      throw new UnauthorizedError('Discord account not connected or refresh token not found');
    }

    throw new Error('Discord token refresh not implemented. Implement Discord API call.');
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = jwtService.verifyRefreshToken(refreshToken);

    const tokenHash = jwtService.hashToken(refreshToken);

    const isValid = await this.userRepo.verifyRefreshToken(payload.userId, tokenHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await this.userRepo.findById(payload.userId);
    if (!user || user.status !== 'active') {
      throw new UnauthorizedError('User not found or inactive');
    }

    await this.userRepo.removeRefreshToken(payload.userId, tokenHash);

    const tokens = await this.generateTokens(user);

    return tokens;
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = jwtService.hashToken(refreshToken);
    await this.userRepo.removeRefreshToken(userId, tokenHash);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.userRepo.removeAllRefreshTokens(userId);
  }

  async sendVerificationEmail(userId: string, email: string, name: string): Promise<void> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = dayjs().add(24, 'hours').toDate();

    await this.userRepo.saveEmailVerifyToken(userId, token, expiresAt);

    try {
      const sent = await emailService.sendVerificationEmail(email, name, token, userId);
      if (!sent) {
        logger.warn('Verification email send returned false', {
          userId,
          email,
        });
      }
    } catch (error) {
      logger.error('Failed to send verification email', {
        userId,
        email,
        error,
      });
    }
  }

  async verifyEmail(token: string): Promise<UserDocument> {
    const user = await this.userRepo.verifyEmail(token);
    if (!user) {
      throw new ValidationError('Invalid or expired verification token');
    }

    return user;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = dayjs().add(1, 'hour').toDate();

    await this.userRepo.saveResetToken(email, token, expiresAt);

    try {
      const sent = await emailService.sendPasswordResetEmail(
        email,
        user.name,
        token,
        user._id.toString(),
      );

      if (!sent) {
        logger.warn('Password reset email send returned false', {
          email,
          userId: user._id.toString(),
        });
      }
    } catch (error) {
      logger.error('Failed to send password reset email', {
        email,
        userId: user._id.toString(),
        error,
      });
    }
  }

  async resetPassword(data: { token: string, newPassword: string }): Promise<void> {
    if (data.newPassword.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    const user = await this.userRepo.resetPassword(data.token, data.newPassword);
    if (!user) {
      throw new ValidationError('Invalid or expired reset token');
    }

    await this.userRepo.removeAllRefreshTokens(user._id.toString());
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepo.findByEmail(
      (await this.userRepo.findById(userId))!.email
    );

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    if (newPassword.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    user.password = newPassword;
    await user.save();

    await this.userRepo.removeAllRefreshTokens(userId);
  }

  async getCurrentUser(userId: string): Promise<UserDocument> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }

  private async generateTokens(user: UserDocument): Promise<TokenPair> {
    const tokens = jwtService.generateTokenPair({
      _id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const tokenHash = jwtService.hashToken(tokens.refreshToken);
    const expiresAt = dayjs().add(7, 'days').toDate();
    await this.userRepo.saveRefreshToken(user._id.toString(), tokenHash, expiresAt);

    return tokens;
  }
}

export const authService = new AuthService();