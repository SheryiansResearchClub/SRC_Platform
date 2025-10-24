import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    description: String,
    type: {
      type: String,
      enum: ['project', 'task', 'resource', 'general'],
      default: 'general'
    },
    color: {
      type: String,
      required: true,
      default: '#6B7280'
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  }
);

TagSchema.index({ name: 'text', description: 'text' });
TagSchema.index({ type: 1, usageCount: -1 });

type TagType = InferSchemaType<typeof TagSchema>;
type TagDocument = HydratedDocument<TagType>;

export { TagDocument, TagType };
export const Tag = model<TagType>('Tag', TagSchema);
