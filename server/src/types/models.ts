// user.model.ts
import type { Model } from "mongoose"
import type { UserDocument, UserType } from "@/models/user.model"

export type { UserDocument, UserType } from "@/models/user.model"

export type { CallbackWithoutResultAndOptionalError, HydratedDocument, InferSchemaType } from "mongoose"
export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasDiscordConnected(): boolean;
  isDiscordTokenExpired(): boolean;
}

export interface UserModel extends Model<UserType, {}, UserMethods> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findByDiscordId(discordId: string): Promise<UserDocument | null>;
  findByDiscordIdWithTokens(discordId: string): Promise<UserDocument | null>;
}