import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const BadgeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
      index: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    iconUrl: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    criteria: {
      type: {
        type: String,
        enum: ['task', 'project', 'contribution', 'special'],
        default: 'task'
      },
      threshold: {
        type: Number,
        min: 1
      },
      condition: String
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    category: {
      type: String,
      enum: ['achievement', 'milestone', 'special'],
      default: 'achievement'
    }
  },
  {
    timestamps: true,
  }
);

BadgeSchema.index({ name: 'text', description: 'text' });
BadgeSchema.index({ category: 1, rarity: 1, points: -1 });

type BadgeType = InferSchemaType<typeof BadgeSchema>;
type BadgeDocument = HydratedDocument<BadgeType>;

export { BadgeDocument, BadgeType };
export const Badge = model<BadgeType>('Badge', BadgeSchema);
