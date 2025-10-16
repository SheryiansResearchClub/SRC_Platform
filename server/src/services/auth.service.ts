import { UserRepository } from '@/repositories/user.repository';
import { jwtService } from '@/lib/auth/jwt';
import type { UserDocument } from '@/types/models';
import {
  UnauthorizedError,
  ValidationError,
  ConflictError
} from '@/utils/errors';
import { emailService } from '@/services/email.service';
import { logger } from '@/utils/logger';
import crypto from 'crypto';
import dayjs from 'dayjs';
import type { Tokens } from '@/types/auth';

class AuthService {
  private userRepo = new UserRepository();

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: UserDocument; tokens: Tokens }> {
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
  }): Promise<{ user: UserDocument; tokens: Tokens }> {
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

  async oauthLogin(
    provider: 'google' | 'discord',
    profile: {
      id: string;
      email: string;
      name: string;
      avatarUrl?: string;
    }
  ): Promise<{ user: UserDocument; tokens: Tokens; isNewUser: boolean }> {
    // Check if user exists with OAuth ID
    let user = await this.userRepo.findByOAuthId(profile.id, provider);
    let isNewUser = false;

    if (!user) {
      // Check if email already exists
      user = await this.userRepo.findByEmail(profile.email);

      if (user) {
        // Link OAuth account to existing user
        user = await this.userRepo.update(user._id.toString(), {
          oauthId: profile.id,
          oauthProvider: provider,
          isEmailVerified: true
        });
      } else {
        // Create new user
        user = await this.userRepo.create({
          name: profile.name,
          email: profile.email,
          oauthProvider: provider,
          oauthId: profile.id,
          avatarUrl: profile.avatarUrl,
          role: 'member'
        });

        // Mark email as verified for OAuth users
        await this.userRepo.update(user._id.toString(), {
          isEmailVerified: true
        });

        isNewUser = true;
      }
    }

    // Update last login
    await this.userRepo.updateLastLogin(user!._id.toString());

    // Generate tokens
    const tokens = await this.generateTokens(user!);

    return { user: user!, tokens, isNewUser };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify refresh token
    const payload = jwtService.verifyRefreshToken(refreshToken);

    // Hash the token
    const tokenHash = jwtService.hashToken(refreshToken);

    // Verify token exists in database
    const isValid = await this.userRepo.verifyRefreshToken(payload.userId, tokenHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Get user
    const user = await this.userRepo.findById(payload.userId);
    if (!user || user.status !== 'active') {
      throw new UnauthorizedError('User not found or inactive');
    }

    // Remove old refresh token
    await this.userRepo.removeRefreshToken(payload.userId, tokenHash);

    // Generate new tokens
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
    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = dayjs().add(24, 'hours').toDate();

    // Save token
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
    // Get user with password
    const user = await this.userRepo.findByEmail(
      (await this.userRepo.findById(userId))!.email
    );

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Remove all refresh tokens (logout from all devices)
    await this.userRepo.removeAllRefreshTokens(userId);
  }

  async getCurrentUser(userId: string): Promise<UserDocument> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }

  private async generateTokens(user: UserDocument) {
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

/*

// OAuth Login
const { user, tokens, isNewUser } = await authService.oauthLogin('google', {
  id: 'google-user-id',
  email: 'john@example.com',
  name: 'John Doe',
  avatarUrl: 'https://...'
});

// Refresh Token
const newTokens = await authService.refreshToken(oldRefreshToken);

// Logout
await authService.logout(userId, refreshToken); 

// Logout All Devices
await authService.logoutAll(userId);

// Send Verification Email
await authService.sendVerificationEmail(userId, email);

// Verify Email
const user = await authService.verifyEmail(token);

// Request Password Reset
await authService.requestPasswordReset('john@example.com');

// Reset Password
await authService.resetPassword(token, 'newPassword123');

// Change Password
await authService.changePassword(userId, 'oldPassword', 'newPassword');

// Get Current User
const user = await authService.getCurrentUser(userId);
*/