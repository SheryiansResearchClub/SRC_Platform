import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const GamificationPointSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true },
    category: { type: String, required: true },
    reason: { type: String },
    awardedBy: { type: String, default: 'system' },
  },
  { timestamps: true }
);

type GamificationPointType = InferSchemaType<typeof GamificationPointSchema>;
type GamificationPointDocument = HydratedDocument<GamificationPointType>;

export const GamificationPoint = model<GamificationPointType>(
  'GamificationPoint',
  GamificationPointSchema
);

export type { GamificationPointType, GamificationPointDocument };