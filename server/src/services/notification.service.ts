import { notificationRepo } from '@/repositories/notification.repository';
import { activityLogRepo } from '@/repositories/activity-log.repository';
import { InternalServerError } from '@/utils/errors';
import type { NotificationDocument } from '@/types';

interface NotificationQuery {
  page?: number;
  limit?: number;
  type?: string;
  read?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginationResult {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

class NotificationService {
  async createNotification(notificationData: {
    title: string;
    message: string;
    type: 'task' | 'comment' | 'project' | 'system' | 'event' | 'mention' | 'deadline';
    createdBy: string;
    actionUrl?: string;
    priority?: 'low' | 'medium' | 'high';
    channel?: 'in-app' | 'email' | 'push';
  }): Promise<NotificationDocument> {
    try {
      const notification = await notificationRepo.create({
        user: notificationData.createdBy,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: notificationData.actionUrl,
        priority: notificationData.priority,
        channel: notificationData.channel,
      });

      await activityLogRepo.create({
        action: 'notification_created',
        entityType: 'Notification',
        entityId: String(notification._id),
        user: notificationData.createdBy,
        metadata: { type: notificationData.type, user: notificationData.createdBy },
      });

      return notification;
    } catch (error) {
      throw new InternalServerError('NOTIFICATION_CREATE_FAILED');
    }
  }

  async getNotifications(userId: string, query: NotificationQuery) {
    try {
      const { page = 1, limit = 20, type, read, sortBy = 'createdAt', sortOrder = 'desc' } = query;

      const notifications = await notificationRepo.findByUser(userId, {
        type,
        read: read ? read === 'true' : undefined,
        page,
        limit,
        sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
      });

      const totalCount = await notificationRepo.countUnreadByUser(userId);
      const totalPages = Math.ceil(totalCount / limit);
      const pagination: PaginationResult = {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };

      return { notifications, pagination };
    } catch (error) {
      throw new InternalServerError('NOTIFICATIONS_FETCH_FAILED');
    }
  }

  async getNotificationById(notificationId: string) {
    try {
      return await notificationRepo.findById(notificationId);
    } catch (error) {
      throw new InternalServerError('NOTIFICATION_FETCH_FAILED');
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await notificationRepo.markAsRead(notificationId);

      await activityLogRepo.create({
        action: 'notification_marked_read',
        entityType: 'Notification',
        entityId: notificationId,
        user: userId,
      });

      return notification;
    } catch (error) {
      throw new InternalServerError('NOTIFICATION_MARK_READ_FAILED');
    }
  }

  async markAllAsRead(userId: string) {
    try {
      const count = await notificationRepo.markAllAsRead(userId);

      await activityLogRepo.create({
        action: 'notifications_marked_read',
        entityType: 'Notification',
        entityId: userId,
        user: userId,
        metadata: { count },
      });

      return count;
    } catch (error) {
      throw new InternalServerError('NOTIFICATIONS_MARK_ALL_READ_FAILED');
    }
  }

  async deleteNotification(notificationId: string, userId: string) {
    try {
      await notificationRepo.delete(notificationId);

      await activityLogRepo.create({
        user: userId,
        action: 'notification_deleted',
        entityType: 'Notification',
        entityId: notificationId,
        metadata: { notificationId },
      });
    } catch (error) {
      throw new InternalServerError('NOTIFICATION_DELETE_FAILED');
    }
  }

  async getUnreadCount(userId: string) {
    try {
      const count = await notificationRepo.countUnreadByUser(userId);
      return { count };
    } catch (error) {
      throw new InternalServerError('UNREAD_COUNT_FETCH_FAILED');
    }
  }
}

export const notificationService = new NotificationService();