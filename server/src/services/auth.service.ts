import { UserRepository } from '@/repositories/user.repository';
import { jwtService } from '@/lib/auth/jwt';
import type { UserDocument } from '@/types/models';
import {
  UnauthorizedError,
  ValidationError,
  ConflictError
} from '@/utils/errors';
import crypto from 'crypto';
import dayjs from 'dayjs';

export class AuthService {
  private userRepo = new UserRepository();

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: UserDocument; tokens: any }> {
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

    await this.sendVerificationEmail(user._id.toString(), user.email);
    const tokens = await this.generateTokens(user);

    return { user, tokens };
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: UserDocument; tokens: any }> {
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

  // OAuth login (Google, Discord)
  async oauthLogin(
    provider: 'google' | 'discord',
    profile: {
      id: string;
      email: string;
      name: string;
      avatarUrl?: string;
    }
  ): Promise<{ user: UserDocument; tokens: any; isNewUser: boolean }> {
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

  // Refresh access token
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

  // Logout (remove refresh token)
  async logout(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = jwtService.hashToken(refreshToken);
    await this.userRepo.removeRefreshToken(userId, tokenHash);
  }

  // Logout from all devices
  async logoutAll(userId: string): Promise<void> {
    await this.userRepo.removeAllRefreshTokens(userId);
  }

  // Send verification email
  async sendVerificationEmail(userId: string, email: string): Promise<void> {
    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = dayjs().add(24, 'hours').toDate();

    // Save token
    await this.userRepo.saveEmailVerifyToken(userId, token, expiresAt);

    // TODO: Send email with verification link
    // await emailService.sendVerificationEmail(email, token);

    console.log(`Verification token for ${email}: ${token}`);
  }

  // Verify email
  async verifyEmail(token: string): Promise<UserDocument> {
    const user = await this.userRepo.verifyEmail(token);
    if (!user) {
      throw new ValidationError('Invalid or expired verification token');
    }

    return user;
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = dayjs().add(1, 'hour').toDate();

    // Save token
    await this.userRepo.saveResetToken(email, token, expiresAt);

    // TODO: Send email with reset link
    // await emailService.sendPasswordResetEmail(email, token);

    console.log(`Password reset token for ${email}: ${token}`);
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Validate password
    if (newPassword.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    const user = await this.userRepo.resetPassword(token, newPassword);
    if (!user) {
      throw new ValidationError('Invalid or expired reset token');
    }

    // Remove all refresh tokens (logout from all devices)
    await this.userRepo.removeAllRefreshTokens(user._id.toString());
  }

  // Change password (for logged-in user)
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

  // Get current user profile
  async getCurrentUser(userId: string): Promise<UserDocument> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }

  // Private helper: Generate access and refresh tokens
  private async generateTokens(user: UserDocument) {
    const tokens = jwtService.generateTokenPair({
      _id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // Save refresh token hash in database
    const tokenHash = jwtService.hashToken(tokens.refreshToken);
    const expiresAt = dayjs().add(7, 'days').toDate();
    await this.userRepo.saveRefreshToken(user._id.toString(), tokenHash, expiresAt);

    return tokens;
  }
}

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