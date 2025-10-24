import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['task', 'comment', 'project', 'system', 'event', 'mention', 'deadline'],
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    payload: Schema.Types.Mixed,
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: Date,
    deliveredAt: Date,
    channel: {
      type: String,
      enum: ['in-app', 'email', 'push'],
      default: 'in-app'
    },
    actionUrl: String,
    actionText: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    expiresAt: Date
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, type: 1, read: 1 });

type NotificationType = InferSchemaType<typeof NotificationSchema>;
type NotificationDocument = HydratedDocument<NotificationType>;

export { NotificationDocument, NotificationType };
export const Notification = model<NotificationType>('Notification', NotificationSchema);
