import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 2000,
      index: 'text'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      index: true
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      index: true
    },
    attachments: [{
      url: String,
      storageKey: String,
      mimeType: String,
      size: Number,
      filename: String
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
      index: true
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date,
    moderationReason: String,
    reactions: {
      like: {
        type: Number,
        default: 0
      },
      useful: {
        type: Number,
        default: 0
      },
      users: [{
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        type: {
          type: String,
          enum: ['like', 'useful'],
          required: true
        }
      }]
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    },
    replies: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    editedAt: Date,
    editedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    mentions: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
CommentSchema.index({ content: 'text' });
CommentSchema.index({ status: 1, createdAt: -1 });
CommentSchema.index({ project: 1, status: 1, createdAt: -1 });
CommentSchema.index({ task: 1, status: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1, createdAt: 1 });

type CommentType = InferSchemaType<typeof CommentSchema>;
type CommentDocument = HydratedDocument<CommentType>;

export { CommentDocument, CommentType };
export const Comment = model<CommentType>('Comment', CommentSchema);
