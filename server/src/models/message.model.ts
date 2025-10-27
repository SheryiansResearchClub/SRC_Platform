import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const AttachmentSchema = new Schema({
  url: String,
  storageKey: String,
  mimeType: String,
  filename: String,
  size: Number
}, { _id: false });

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: false,
      index: true
    },
    conversationId: {
      type: String,
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
    attachments: [AttachmentSchema],
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
    editedAt: Date,
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date
  },
  {
    timestamps: true
  }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ project: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, createdAt: -1 });

type MessageType = InferSchemaType<typeof MessageSchema>;
type MessageDocument = HydratedDocument<MessageType>;

export { MessageDocument, MessageType };
export const Message = model<MessageType>('Message', MessageSchema);