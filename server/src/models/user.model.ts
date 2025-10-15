import {
  Schema,
  model,
  type CallbackWithoutResultAndOptionalError,
  type HydratedDocument,
  type InferSchemaType,
  type Model
} from 'mongoose';

import bcrypt from 'bcrypt';

interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

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
      required: true,
      minlength: 6,
      select: false
    },
    oauthProvider: {
      type: String,
      enum: ['email', 'google', 'discord'],
      default: 'email'
    },
    oauthId: {
      type: String,
      sparse: true
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
    isEmailVerified: { type: Boolean, default: false },
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
    }
  },
  {
    timestamps: true
  }
);

type UserType = InferSchemaType<typeof UserSchema>;
type UserDocument = HydratedDocument<UserType> & UserMethods;

interface UserModel extends Model<UserType, {}, UserMethods> { }

UserSchema.methods.comparePassword = async function (
  this: UserDocument,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email }).select('+password');
};

UserSchema.pre('save', async function (
  this: UserDocument,
  next: CallbackWithoutResultAndOptionalError
) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = model<UserType, UserModel>('User', UserSchema);

export type { UserType, UserDocument };