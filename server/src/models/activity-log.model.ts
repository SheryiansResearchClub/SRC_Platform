import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const ActivityLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    action: {
      type: String,
      required: true,
      index: true
    },
    entityType: {
      type: String,
      enum: ['User', 'Project', 'Task', 'Comment', 'File', 'Resource', 'Event', 'Message', 'Notification', 'Badge', 'Tag', 'Gamification'],
      required: true
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    metadata: Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
ActivityLogSchema.index({ user: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });

type ActivityLogType = InferSchemaType<typeof ActivityLogSchema>;
type ActivityLogDocument = HydratedDocument<ActivityLogType>;

export { ActivityLogDocument, ActivityLogType };
export const ActivityLog = model<ActivityLogType>('ActivityLog', ActivityLogSchema);
