import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const FileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    storageKey: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      enum: ['document', 'image', 'video', 'code', 'other'],
      default: 'other',
      index: true
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    approved: {
      type: Boolean,
      default: true,
      index: true
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    version: {
      type: Number,
      default: 1,
      min: 1
    },
    versions: [{
      versionNumber: {
        type: Number,
        required: true
      },
      storageKey: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      },
      changelog: String,
      size: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    downloadCount: {
      type: Number,
      default: 0,
      min: 0
    },
    scanStatus: {
      type: String,
      enum: ['pending', 'clean', 'infected', 'failed'],
      default: 'pending',
      index: true
    },
    deletedAt: Date,
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
FileSchema.index({ name: 'text' });
FileSchema.index({ project: 1, uploadedBy: 1, approved: 1, createdAt: -1 });
FileSchema.index({ category: 1, approved: 1 });

type FileType = InferSchemaType<typeof FileSchema>;
type FileDocument = HydratedDocument<FileType>;

export { FileDocument, FileType };
export const File = model<FileType>('File', FileSchema);
