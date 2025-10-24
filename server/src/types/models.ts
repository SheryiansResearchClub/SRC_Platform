// user.model.ts
import type { Model } from "mongoose"
import type { UserDocument, UserType } from "@/models/user.model"

export type { UserDocument, UserType } from "@/models/user.model"

// project.model.ts
export type { ProjectDocument, ProjectType } from "@/models/project.model"

// task.model.ts
export type { TaskDocument, TaskType } from "@/models/task.model"

// badge.model.ts
export type { BadgeDocument, BadgeType } from "@/models/badge.model"

// comment.model.ts
export type { CommentDocument, CommentType } from "@/models/comment.model"

// file.model.ts
export type { FileDocument, FileType } from "@/models/file.model"

// preview.model.ts
export type { PreviewDocument, PreviewType } from "@/models/preview.model"

// notification.model.ts
export type { NotificationDocument, NotificationType } from "@/models/notification.model"

// resource.model.ts
export type { ResourceDocument, ResourceType } from "@/models/resource.model"

// event.model.ts
export type { EventDocument, EventType } from "@/models/event.model"

// message.model.ts
export type { MessageDocument, MessageType } from "@/models/message.model"

// tag.model.ts
export type { TagDocument, TagType } from "@/models/tag.model"

// activity-log.model.ts
export type { ActivityLogDocument, ActivityLogType } from "@/models/activity-log.model"

// analytics.model.ts
export type { AnalyticsDocument, AnalyticsType } from "@/models/analytics.model"

export type { CallbackWithoutResultAndOptionalError, HydratedDocument, InferSchemaType } from "mongoose"
export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasDiscordConnected(): boolean;
  isDiscordTokenExpired(): boolean;
  hasGoogleConnected(): boolean;
  isGoogleTokenExpired(): boolean;
}

export interface UserModel extends Model<UserType, {}, UserMethods> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findByDiscordId(discordId: string): Promise<UserDocument | null>;
  findByDiscordIdWithTokens(discordId: string): Promise<UserDocument | null>;
  findByGoogleId(googleId: string): Promise<UserDocument | null>;
  findByGoogleIdWithTokens(googleId: string): Promise<UserDocument | null>;
}