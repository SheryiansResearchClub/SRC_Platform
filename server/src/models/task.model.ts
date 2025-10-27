import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true
    },
    description: {
      type: String,
      maxlength: 2000
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'done', 'blocked'],
      default: 'todo',
      index: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true
    },
    startDate: Date,
    dueDate: {
      type: Date,
      index: true
    },
    completedAt: Date,
    points: {
      type: Number,
      default: 0,
      min: 0
    },
    estimatedHours: {
      type: Number,
      min: 0
    },
    actualHours: {
      type: Number,
      min: 0
    },
    dependencies: [{
      type: Schema.Types.ObjectId,
      ref: 'Task'
    }],
    blockedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'Task'
    }],
    remindersSent: {
      oneDayBefore: { type: Boolean, default: false },
      onHourBefore: { type: Boolean, default: false }
    },
    archived: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

TaskSchema.index({ title: 'text', description: 'text' });
TaskSchema.index({ project: 1, status: 1, assignee: 1 });
TaskSchema.index({ assignee: 1, dueDate: 1, status: 1 });
TaskSchema.index({ dueDate: 1, status: 1 });

TaskSchema.virtual('isOverdue').get(function (this: TaskDocument) {
  return this.dueDate && !['done', 'blocked'].includes(this.status) && new Date() > this.dueDate;
});

type TaskType = InferSchemaType<typeof TaskSchema>;
type TaskDocument = HydratedDocument<TaskType>;

export { TaskDocument, TaskType };
export const Task = model<TaskType>('Task', TaskSchema);
