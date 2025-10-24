import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const ResourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    uploader: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: ['tutorial', 'document', 'snippet', 'reference', 'tool'],
      required: true,
      index: true
    },
    storageKey: String,
    url: String,
    size: {
      type: Number,
      min: 0
    },
    mimeType: String,
    externalUrl: String,
    isExternal: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true,
      index: true
    }],
    downloads: {
      type: Number,
      default: 0,
      min: 0
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0
    },
    likedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    approved: {
      type: Boolean,
      default: true
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
ResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
ResourceSchema.index({ category: 1, featured: 1, downloads: -1 });
ResourceSchema.index({ uploader: 1, approved: 1 });

type ResourceType = InferSchemaType<typeof ResourceSchema>;
type ResourceDocument = HydratedDocument<ResourceType>;

export { ResourceDocument, ResourceType };
export const Resource = model<ResourceType>('Resource', ResourceSchema);
