import type { UserMethods, UserModel, CallbackWithoutResultAndOptionalError, HydratedDocument, InferSchemaType } from '@/types';
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 120,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      minlength: 6,
      select: false
    },
    oauthProvider: {
      type: String,
      enum: ['email', 'google', 'discord'],
      default: 'email'
    },
    googleId: {
      type: String,
      sparse: true,
      index: true
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member',
      index: true
    },
    avatarUrl: String,
    bio: { type: String, maxlength: 1000 },
    skills: [{ type: String }],
    // Auth fields
    isEmailVerified: { type: Boolean, default: false, index: true },
    emailVerifyToken: { type: String, select: false },
    emailVerifyExpires: { type: Date, select: false },
    resetToken: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
    refreshTokens: {
      type: [
        {
          tokenHash: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
          expiresAt: { type: Date, required: true }
        }
      ],
      default: [],
      select: false
    },
    // Stats
    projectCount: { type: Number, default: 0, index: true },
    taskCount: { type: Number, default: 0, index: true },
    completedTaskCount: { type: Number, default: 0, index: true },
    onTimeCompletionRate: { type: Number, default: 0 },
    // Gamification
    points: { type: Number, default: 0, index: true },
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    achievements: [String],
    activityStreak: { type: Number, default: 0 },
    // Preferences
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      taskDeadlineReminder: { type: Number, default: 24 },
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto'
      }
    },
    // Activity
    lastLoginAt: Date,
    lastActiveAt: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
      index: true
    },
    // Discord OAuth sub-document
    discord: {
      id: {
        type: String,
        sparse: true,
        index: true
      },
      username: String,
      discriminator: {
        type: String,
        default: '0'
      },
      avatar: String,
      accessToken: {
        type: String,
        select: false
      },
      refreshToken: {
        type: String,
        select: false
      },
      expiresAt: Date,
      scopes: [{ type: String }],
      connectedAt: {
        type: Date,
        default: Date.now
      }
    },
    // Google OAuth sub-document
    google: {
      id: {
        type: String,
        sparse: true,
        index: true
      },
      email: String,
      name: String,
      picture: String,
      accessToken: {
        type: String,
        select: false
      },
      refreshToken: {
        type: String,
        select: false
      },
      expiresAt: Date,
      scopes: [{ type: String }],
      connectedAt: {
        type: Date,
        default: Date.now
      }
    }
  },
  {
    timestamps: true
  }
);

UserSchema.index({ name: 'text', email: 'text', skills: 'text', bio: 'text' });
UserSchema.index({ role: 1, status: 1, lastActiveAt: -1 });
UserSchema.index({ points: -1, completedTaskCount: -1 });

type UserType = InferSchemaType<typeof UserSchema>;
type UserDocument = HydratedDocument<UserType> & UserMethods;

UserSchema.methods.comparePassword = async function (
  this: UserDocument,
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.hasGoogleConnected = function (this: UserDocument): boolean {
  return Boolean(this.google?.id);
};
UserSchema.methods.isGoogleTokenExpired = function (this: UserDocument): boolean {
  if (!this.google?.expiresAt) return true;
  return new Date() >= this.google.expiresAt;
};

UserSchema.statics.findByEmail = async function (email: string): Promise<UserDocument | null> {
  return this.findOne({ email }).select('+password');
};

UserSchema.statics.findByDiscordId = async function (
  discordId: string
): Promise<UserDocument | null> {
  return this.findOne({ 'discord.id': discordId });
};

UserSchema.statics.findByDiscordIdWithTokens = async function (
  discordId: string
): Promise<UserDocument | null> {
  return this.findOne({ 'discord.id': discordId }).select(
    '+discord.accessToken +discord.refreshToken'
  );
};

UserSchema.statics.findByGoogleId = async function (
  googleId: string
): Promise<UserDocument | null> {
  return this.findOne({ 'google.id': googleId }).select(
    '+google.accessToken +google.refreshToken'
  );
};

UserSchema.statics.findByGoogleIdWithTokens = async function (
  googleId: string
): Promise<UserDocument | null> {
  return this.findOne({ 'google.id': googleId }).select(
    '+google.accessToken +google.refreshToken'
  );
};

UserSchema.pre('save', async function (
  this: UserDocument,
  next: CallbackWithoutResultAndOptionalError
) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = model<UserType, UserModel>('User', UserSchema);

export type { UserType, UserDocument };