import type { ActivityLogDocument } from '@/types';
import { ActivityLog } from '@/models';
class ActivityLogRepository {
  async create(activityData: {
    user: string;
    action: string;
    entityType: 'User' | 'Project' | 'Task' | 'Comment' | 'File' | 'Resource' | 'Event' | 'Message' | 'Notification' | 'Badge' | 'Tag' | 'Gamification';
    entityId: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ActivityLogDocument> {
    const activity = await ActivityLog.create(activityData);
    return activity as ActivityLogDocument;
  }

  async findById(activityId: string): Promise<ActivityLogDocument | null> {
    return await ActivityLog.findById(activityId)
      .populate('user', 'name email avatarUrl')
      .exec() as ActivityLogDocument | null;
  }

  async findByUser(userId: string, options: {
    action?: string;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}): Promise<ActivityLogDocument[]> {
    const {
      action,
      entityType,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sort = '-createdAt'
    } = options;

    const query: any = { user: userId };

    if (action) query.action = action;
    if (entityType) query.entityType = entityType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    return await ActivityLog.find(query)
      .populate('user', 'name email avatarUrl')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as ActivityLogDocument[];
  }

  async findByEntity(entityType: string, entityId: string, options: {
    userId?: string;
    action?: string;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}): Promise<ActivityLogDocument[]> {
    const {
      userId,
      action,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = options;

    const query: any = { entityType, entityId };

    if (userId) query.user = userId;
    if (action) query.action = action;

    return await ActivityLog.find(query)
      .populate('user', 'name email avatarUrl')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as ActivityLogDocument[];
  }

  async findByAction(action: string, options: {
    entityType?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}): Promise<ActivityLogDocument[]> {
    const {
      entityType,
      userId,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sort = '-createdAt'
    } = options;

    const query: any = { action };

    if (entityType) query.entityType = entityType;
    if (userId) query.user = userId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    return await ActivityLog.find(query)
      .populate('user', 'name email avatarUrl')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as ActivityLogDocument[];
  }

  async findByDateRange(startDate: Date, endDate: Date, options: {
    userId?: string;
    entityType?: string;
    action?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ActivityLogDocument[]> {
    const { userId, entityType, action, page = 1, limit = 100 } = options;

    const query: any = {
      createdAt: { $gte: startDate, $lte: endDate }
    };

    if (userId) query.user = userId;
    if (entityType) query.entityType = entityType;
    if (action) query.action = action;

    return await ActivityLog.find(query)
      .populate('user', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as ActivityLogDocument[];
  }

  async getUserActivitySummary(userId: string, options: {
    days?: number;
    entityType?: string;
  } = {}): Promise<{
    totalActions: number;
    actionsByType: Record<string, number>;
    actionsByEntity: Record<string, number>;
    dailyActivity: Array<{ date: string; count: number }>;
  }> {
    const { days = 30, entityType } = options;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const query: any = {
      user: userId,
      createdAt: { $gte: startDate }
    };

    if (entityType) query.entityType = entityType;

    const [totalActions, actionsByType, actionsByEntity, dailyActivity] = await Promise.all([
      ActivityLog.countDocuments(query),
      this.getActionsByType(userId, startDate),
      this.getActionsByEntity(userId, startDate),
      this.getDailyActivity(userId, startDate)
    ]);

    return {
      totalActions,
      actionsByType,
      actionsByEntity,
      dailyActivity
    };
  }

  private async getActionsByType(userId: string, startDate: Date): Promise<Record<string, number>> {
    const results = await ActivityLog.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);

    const actionsByType: Record<string, number> = {};
    results.forEach(result => {
      actionsByType[result._id] = result.count;
    });

    return actionsByType;
  }

  private async getActionsByEntity(userId: string, startDate: Date): Promise<Record<string, number>> {
    const results = await ActivityLog.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$entityType',
          count: { $sum: 1 }
        }
      }
    ]);

    const actionsByEntity: Record<string, number> = {};
    results.forEach(result => {
      actionsByEntity[result._id] = result.count;
    });

    return actionsByEntity;
  }

  private async getDailyActivity(userId: string, startDate: Date): Promise<Array<{ date: string; count: number }>> {
    const results = await ActivityLog.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    return results.map(result => ({
      date: result._id,
      count: result.count
    }));
  }

  async getRecentActivity(options: {
    userId?: string;
    entityType?: string;
    action?: string;
    limit?: number;
  } = {}): Promise<ActivityLogDocument[]> {
    const { userId, entityType, action, limit = 50 } = options;

    const query: any = {};

    if (userId) query.user = userId;
    if (entityType) query.entityType = entityType;
    if (action) query.action = action;

    return await ActivityLog.find(query)
      .populate('user', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec() as ActivityLogDocument[];
  }

  async searchActivity(query: string, options: {
    userId?: string;
    entityType?: string;
    action?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ActivityLogDocument[]> {
    const {
      userId,
      entityType,
      action,
      page = 1,
      limit = 20
    } = options;

    const searchQuery: any = {
      action: { $regex: query, $options: 'i' }
    };

    if (userId) searchQuery.user = userId;
    if (entityType) searchQuery.entityType = entityType;
    if (action) searchQuery.action = action;

    return await ActivityLog.find(searchQuery)
      .populate('user', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as ActivityLogDocument[];
  }

  async getActivityStats(options: {
    days?: number;
  } = {}): Promise<{
    totalActivities: number;
    activitiesByUser: Array<{ user: string; count: number }>;
    activitiesByAction: Record<string, number>;
    activitiesByEntity: Record<string, number>;
    dailyActivity: Array<{ date: string; count: number }>;
  }> {
    const { days = 30 } = options;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalActivities, activitiesByUser, activitiesByAction, activitiesByEntity, dailyActivity] = await Promise.all([
      ActivityLog.countDocuments({ createdAt: { $gte: startDate } }),
      this.getActivitiesByUser(startDate),
      this.getActivitiesByAction(startDate),
      this.getActivitiesByEntityType(startDate),
      this.getOverallDailyActivity(startDate)
    ]);

    return {
      totalActivities,
      activitiesByUser,
      activitiesByAction,
      activitiesByEntity,
      dailyActivity
    };
  }

  private async getActivitiesByUser(startDate: Date): Promise<Array<{ user: string; count: number }>> {
    const results = await ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return results.map(result => ({
      user: result.user[0]?.name || 'Unknown',
      count: result.count
    }));
  }

  private async getActivitiesByAction(startDate: Date): Promise<Record<string, number>> {
    const results = await ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);

    const activitiesByAction: Record<string, number> = {};
    results.forEach(result => {
      activitiesByAction[result._id] = result.count;
    });

    return activitiesByAction;
  }

  private async getActivitiesByEntityType(startDate: Date): Promise<Record<string, number>> {
    const results = await ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$entityType',
          count: { $sum: 1 }
        }
      }
    ]);

    const activitiesByEntity: Record<string, number> = {};
    results.forEach(result => {
      activitiesByEntity[result._id] = result.count;
    });

    return activitiesByEntity;
  }

  private async getOverallDailyActivity(startDate: Date): Promise<Array<{ date: string; count: number }>> {
    const results = await ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    return results.map(result => ({
      date: result._id,
      count: result.count
    }));
  }

  async deleteOldLogs(olderThanDays: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await ActivityLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    return result.deletedCount || 0;
  }

  async logUserAction(
    userId: string,
    action: string,
    entityType: 'User' | 'Project' | 'Task' | 'Comment' | 'File' | 'Resource' | 'Event' | 'Message' | 'Notification' | 'Badge' | 'Tag',
    entityId: string,
    metadata?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ActivityLogDocument> {
    return await this.create({
      user: userId,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress,
      userAgent
    });
  }

  async getEntityHistory(
    entityType: string,
    entityId: string,
    options: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ActivityLogDocument[]> {
    const { page = 1, limit = 20 } = options;

    return await ActivityLog.find({ entityType, entityId })
      .populate('user', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as ActivityLogDocument[];
  }

  async countByUser(userId: string): Promise<number> {
    return await ActivityLog.countDocuments({ user: userId });
  }

  async countByAction(action: string): Promise<number> {
    return await ActivityLog.countDocuments({ action });
  }

  async countByEntity(entityType: string, entityId: string): Promise<number> {
    return await ActivityLog.countDocuments({ entityType, entityId });
  }
}

export const activityLogRepo = new ActivityLogRepository();
