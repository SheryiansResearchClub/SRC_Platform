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
    return await User.findById(userId) as UserDocument | null;
  }

  async findByOAuthId(oauthId: string, provider: string): Promise<UserDocument | null> {
    let user;
    if (provider === 'google') {
      user = await User.findOne({ 'google.id': oauthId }).select('+google.accessToken +google.refreshToken');
    } else if (provider === 'discord') {
      user = await User.findOne({ 'discord.id': oauthId }).select('+discord.accessToken +discord.refreshToken');
    }
    return user as UserDocument | null;
  }

  async create(userData: {
    name: string;
    email: string;
    password?: string;
    oauthProvider?: string;
    oauthId?: string;
    googleId?: string;
    role?: string;
    avatarUrl?: string;
    bio?: string;
    skills?: string[];
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

  async update(userId: string, data: any): Promise<UserDocument | null> {
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

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return await User.findByGoogleId(googleId) as UserDocument | null;
  }

  async findByGoogleIdWithTokens(googleId: string): Promise<UserDocument | null> {
    return await User.findByGoogleIdWithTokens(googleId) as UserDocument | null;
  }

  async connectGoogle(
    userId: string,
    googleData: {
      id: string;
      email: string;
      name: string;
      picture?: string;
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
          google: {
            ...googleData,
            connectedAt: new Date()
          },
          oauthProvider: 'google',
          googleId: googleData.id
        }
      },
      { new: true }
    ) as UserDocument | null;
  }

  async updateGoogleTokens(
    userId: string,
    accessToken: string,
    refreshToken: string | undefined,
    expiresAt: Date
  ): Promise<UserDocument | null> {
    const updateData: Record<string, unknown> = {
      'google.accessToken': accessToken,
      'google.expiresAt': expiresAt
    };

    if (refreshToken) {
      updateData['google.refreshToken'] = refreshToken;
    }

    return await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }) as UserDocument | null;
  }

  async disconnectGoogle(userId: string): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(userId, { $unset: { google: '' } }, { new: true }) as UserDocument | null;
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

  async findUsersWithPagination(
    query: Record<string, unknown>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>
  ): Promise<UserDocument[]> {
    return await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec() as UserDocument[];
  }

  async countUsers(query: Record<string, unknown>): Promise<number> {
    return await User.countDocuments(query);
  }

  async deleteUser(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email });
    return count > 0;
  }
}

export const userRepo = new UserRepository();