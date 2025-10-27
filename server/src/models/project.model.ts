import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const ProjectSchema = new Schema(
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
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: ['Web', 'AI', 'Electronics', 'Other'],
      default: 'Other',
      index: true
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'paused', 'archived'],
      default: 'ongoing',
      index: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    members: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      role: {
        type: String,
        enum: ['member', 'maintainer', 'owner'],
        default: 'member',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    milestones: [{
      title: String,
      description: String,
      dueDate: Date,
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date,
      completedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    technologies: [{
      type: String,
      trim: true,
    }],
    stats: {
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      taskCount: {
        type: Number,
        default: 0
      },
      completedTaskCount: {
        type: Number,
        default: 0
      },
      overdueTaskCount: {
        type: Number,
        default: 0
      },
      memberCount: {
        type: Number,
        default: 0
      },
      lastActivityAt: Date
    },
    previewMeta: {
      figmaLink: String,
      websiteLink: String,
      mediaCount: {
        type: Number,
        default: 0
      }
    },
    startDate: Date,
    expectedEndDate: Date,
    actualEndDate: Date,
    archived: {
      type: Boolean,
      default: false,
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ title: 'text', description: 'text', tags: 'text', technologies: "text" });
ProjectSchema.index({ type: 1, status: 1, 'stats.progress': -1 });
ProjectSchema.index({ status: 1, priority: 1, expectedEndDate: 1 });
ProjectSchema.index({ 'members.user': 1, status: 1 });
ProjectSchema.index({ featured: 1, status: 1, createdAt: -1 });

type ProjectType = InferSchemaType<typeof ProjectSchema>;
type ProjectDocument = HydratedDocument<ProjectType>;
type MilestoneType = ProjectType['milestones'][number];

export { ProjectDocument, ProjectType, MilestoneType };
export const Project = model<ProjectType>('Project', ProjectSchema);
