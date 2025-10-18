import type { UserDocument } from "@/types";
export type GoogleProfileType = Pick<UserDocument, '_id' | 'email' | 'name' | 'avatarUrl'>