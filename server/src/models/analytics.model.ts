import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const AnalyticsSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    userMetrics: {
      totalUsers: {
        type: Number,
        default: 0,
        min: 0
      },
      activeUsers: {
        type: Number,
        default: 0,
        min: 0
      },
      newUsers: {
        type: Number,
        default: 0,
        min: 0
      },
      loginCount: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    projectMetrics: {
      totalProjects: {
        type: Number,
        default: 0,
        min: 0
      },
      activeProjects: {
        type: Number,
        default: 0,
        min: 0
      },
      completedProjects: {
        type: Number,
        default: 0,
        min: 0
      },
      newProjects: {
        type: Number,
        default: 0,
        min: 0
      },
      averageProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      }
    },
    taskMetrics: {
      totalTasks: {
        type: Number,
        default: 0,
        min: 0
      },
      completedTasks: {
        type: Number,
        default: 0,
        min: 0
      },
      overdueTasks: {
        type: Number,
        default: 0,
        min: 0
      },
      newTasks: {
        type: Number,
        default: 0,
        min: 0
      },
      averageCompletionTime: {
        type: Number,
        min: 0
      },
      onTimeCompletionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      }
    },
    engagementMetrics: {
      comments: {
        type: Number,
        default: 0,
        min: 0
      },
      fileUploads: {
        type: Number,
        default: 0,
        min: 0
      },
      messages: {
        type: Number,
        default: 0,
        min: 0
      },
      resourceDownloads: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    topPerformers: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      metric: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      }
    }]
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
AnalyticsSchema.index({ type: 1, date: -1 });

type AnalyticsType = InferSchemaType<typeof AnalyticsSchema>;
type AnalyticsDocument = HydratedDocument<AnalyticsType>;

export { AnalyticsDocument, AnalyticsType };
export const Analytics = model<AnalyticsType>('Analytics', AnalyticsSchema);
