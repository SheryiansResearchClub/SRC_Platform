import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    conversationId: {
      type: String,
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'system', 'file'],
      default: 'text'
    },
    attachments: [{
      url: String,
      storageKey: String,
      mimeType: String,
      filename: String,
      size: Number
    }],
    readBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    deletedFor: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    },
    edited: {
      type: Boolean,
      default: false
    },
    editedAt: Date
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ project: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, createdAt: -1 });

type MessageType = InferSchemaType<typeof MessageSchema>;
type MessageDocument = HydratedDocument<MessageType>;

export { MessageDocument, MessageType };
export const Message = model<MessageType>('Message', MessageSchema);
