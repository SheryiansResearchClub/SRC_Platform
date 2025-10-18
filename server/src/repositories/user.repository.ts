import type { UserDocument } from '@/types';
import { User } from '@/models/user.model';

class UserRepository {
  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await User.findOne({ email }).select('-password -refreshTokens');
    if (!user) {
      return null;
    }
    return user as UserDocument;
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return null;
    }
    return user as UserDocument;
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return await User.findById(userId);
  }

  async findByOAuthId(oauthId: string, provider: string): Promise<UserDocument | null> {
    return await User.findOne({ oauthId, oauthProvider: provider });
  }

  async create(userData: {
    name: string;
    email: string;
    password?: string;
    oauthProvider?: string;
    oauthId?: string;
    role?: string;
    avatarUrl?: string;
    discord?: {
      id: string;
      username: string;
      discriminator?: string;
      avatar?: string;
      accessToken: string;
      refreshToken?: string;
      expiresAt: Date;
      scopes: string[];
    };
  }): Promise<UserDocument> {
    const user = await User.create(userData);
    return user as UserDocument;
  }

  async update(userId: string, data: Partial<UserDocument>): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(userId, data, { new: true });
  }

  async findByDiscordId(discordId: string): Promise<UserDocument | null> {
    return await User.findByDiscordId(discordId);
  }

  async findByDiscordIdWithTokens(discordId: string): Promise<UserDocument | null> {
    return await User.findByDiscordIdWithTokens(discordId);
  }

  async connectDiscord(
    userId: string,
    discordData: {
      id: string;
      username: string;
      discriminator: string;
      avatar?: string;
      accessToken: string;
      refreshToken?: string;
      expiresAt: Date;
      scopes: string[];
    }
  ): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          discord: {
            ...discordData,
            connectedAt: new Date()
          },
          oauthProvider: 'discord',
          oauthId: discordData.id
        }
      },
      { new: true }
    );
  }

  async updateDiscordTokens(
    userId: string,
    accessToken: string,
    refreshToken: string | undefined,
    expiresAt: Date
  ): Promise<UserDocument | null> {
    const updateData: Record<string, unknown> = {
      'discord.accessToken': accessToken,
      'discord.expiresAt': expiresAt
    };

    if (refreshToken) {
      updateData['discord.refreshToken'] = refreshToken;
    }

    return await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
  }

  async disconnectDiscord(userId: string): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(userId, { $unset: { discord: '' } }, { new: true });
  }

  async isDiscordIdTaken(discordId: string, excludeUserId?: string): Promise<boolean> {
    const query: Record<string, unknown> = { 'discord.id': discordId };
    if (excludeUserId) {
      query._id = { $ne: excludeUserId };
    }
    const count = await User.countDocuments(query);
    return count > 0;
  }
  async saveRefreshToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date
  ): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $push: {
        refreshTokens: {
          tokenHash,
          createdAt: new Date(),
          expiresAt
        }
      }
    });
  }

  async removeRefreshToken(userId: string, tokenHash: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $pull: {
        refreshTokens: { tokenHash }
      }
    });
  }

  async removeAllRefreshTokens(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] }
    });
  }

  async verifyRefreshToken(userId: string, tokenHash: string): Promise<boolean> {
    const user = await User.findById(userId).select('+refreshTokens');
    if (!user) return false;

    return user.refreshTokens.some(
      (token: any) => token.tokenHash === tokenHash && token.expiresAt > new Date()
    );
  }

  async saveEmailVerifyToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      emailVerifyToken: token,
      emailVerifyExpires: expiresAt
    });
  }

  async verifyEmail(token: string): Promise<UserDocument | null> {
    const user = await User.findOne({
      emailVerifyToken: token,
      emailVerifyExpires: { $gt: new Date() }
    });

    if (!user) return null;

    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    return user as unknown as UserDocument;
  }

  async saveResetToken(email: string, token: string, expiresAt: Date): Promise<UserDocument | null> {
    return await User.findOneAndUpdate(
      { email },
      {
        resetToken: token,
        resetTokenExpires: expiresAt
      },
      { new: true }
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<UserDocument | null> {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }
    }).select('+password');

    if (!user) return null;

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    return user as unknown as UserDocument;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      lastLoginAt: new Date(),
      lastActiveAt: new Date()
    });
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email });
    return count > 0;
  }
}

export const userRepo = new UserRepository();