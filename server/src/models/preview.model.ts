import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const PreviewSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['figma', 'website', 'media'],
      required: true,
      index: true
    },
    figma: {
      url: String,
      fileKey: String,
      meta: Schema.Types.Mixed,
      thumbnailUrl: String
    },
    website: {
      url: String,
      screenshotUrl: String,
      isLive: {
        type: Boolean,
        default: false
      }
    },
    media: [{
      storageKey: String,
      url: String,
      mimeType: String,
      caption: String,
      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      thumbnailUrl: String,
      order: {
        type: Number,
        default: 0
      }
    }],
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notes: String,
    approved: {
      type: Boolean,
      default: true,
      index: true
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
PreviewSchema.index({ project: 1, type: 1, approved: 1 });

type PreviewType = InferSchemaType<typeof PreviewSchema>;
type PreviewDocument = HydratedDocument<PreviewType>;

export { PreviewDocument, PreviewType };
export const Preview = model<PreviewType>('Preview', PreviewSchema);
