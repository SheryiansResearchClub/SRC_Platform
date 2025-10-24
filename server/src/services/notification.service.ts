// import { Notification, NotificationDocument, NotificationType } from '@/models/notification.model';
// import { activityLogRepo } from '@/repositories/activity-log.repository';
// import { AppError } from '@/utils/errors';

// interface NotificationQuery {
//   page?: number;
//   limit?: number;
//   type?: string;
//   read?: string;
//   sortBy?: string;
//   sortOrder?: 'asc' | 'desc';
// }

// interface PaginationResult {
//   currentPage: number;
//   totalPages: number;
//   totalCount: number;
//   hasNext: boolean;
//   hasPrev: boolean;
// }

// class NotificationService {
//   async createNotification(notificationData: {
//     title: string;
//     message: string;
//     type: 'info' | 'success' | 'warning' | 'error';
//     recipient: string;
//     createdBy: string;
//     entityType?: string;
//     entityId?: string;
//     actionUrl?: string;
//     priority?: 'low' | 'medium' | 'high';
//   }): Promise<NotificationDocument> {
//     try {
//       const notification = await Notification.create({
//         ...notificationData,
//         isRead: false
//       });

//       // Log activity
//       await activityLogRepo.create({
//         action: 'notification_created',
//         entityType: 'Notification',
//         entityId: notification._id,
//         user: notificationData.createdBy,
//         metadata: { type: notificationData.type, recipient: notificationData.recipient }
//       });

//       return notification as NotificationDocument;
//     } catch (error) {
//       throw new AppError('NOTIFICATION_CREATE_FAILED', 'Failed to create notification', 500);
//     }
//   }

//   async getNotifications(userId: string, query: NotificationQuery) {
//     try {
//       const { page = 1, limit = 20, type, read, sortBy = 'createdAt', sortOrder = 'desc' } = query;

//       let filter: any = { recipient: userId };

//       if (type) filter.type = type;
//       if (read !== undefined) filter.isRead = read === 'true';

//       const skip = (page - 1) * limit;
//       const sortOptions: any = {};
//       sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

//       const [notifications, totalCount] = await Promise.all([
//         Notification.find(filter)
//           .populate('createdBy', 'name email avatarUrl')
//           .sort(sortOptions)
//           .skip(skip)
//           .limit(limit)
//           .exec(),
//         Notification.countDocuments(filter)
//       ]);

//       const totalPages = Math.ceil(totalCount / limit);
//       const pagination: PaginationResult = {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       };

//       return {
//         notifications,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('NOTIFICATIONS_FETCH_FAILED', 'Failed to fetch notifications', 500);
//     }
//   }

//   async getNotificationById(notificationId: string): Promise<NotificationDocument | null> {
//     try {
//       return await Notification.findById(notificationId)
//         .populate('createdBy', 'name email avatarUrl')
//         .exec() as NotificationDocument | null;
//     } catch (error) {
//       throw new AppError('NOTIFICATION_FETCH_FAILED', 'Failed to fetch notification', 500);
//     }
//   }

//   async markAsRead(notificationId: string, userId: string): Promise<NotificationDocument | null> {
//     try {
//       const notification = await Notification.findOneAndUpdate(
//         { _id: notificationId, recipient: userId },
//         { isRead: true, readAt: new Date() },
//         { new: true }
//       )
//         .populate('createdBy', 'name email avatarUrl')
//         .exec() as NotificationDocument | null;

//       return notification;
//     } catch (error) {
//       throw new AppError('NOTIFICATION_MARK_READ_FAILED', 'Failed to mark notification as read', 500);
//     }
//   }

//   async markAllAsRead(userId: string): Promise<number> {
//     try {
//       const result = await Notification.updateMany(
//         { recipient: userId, isRead: false },
//         { isRead: true, readAt: new Date() }
//       );

//       // Log activity
//       await activityLogRepo.create({
//         action: 'notifications_marked_read',
//         entityType: 'Notification',
//         entityId: userId,
//         user: userId,
//         metadata: { count: result.modifiedCount }
//       });

//       return result.modifiedCount || 0;
//     } catch (error) {
//       throw new AppError('NOTIFICATIONS_MARK_ALL_READ_FAILED', 'Failed to mark all notifications as read', 500);
//     }
//   }

//   async deleteNotification(notificationId: string): Promise<void> {
//     try {
//       await Notification.findByIdAndDelete(notificationId);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'notification_deleted',
//         entityType: 'Notification',
//         entityId: notificationId,
//         metadata: { notificationId }
//       });
//     } catch (error) {
//       throw new AppError('NOTIFICATION_DELETE_FAILED', 'Failed to delete notification', 500);
//     }
//   }

//   async getUnreadCount(userId: string): Promise<{ count: number }> {
//     try {
//       const count = await Notification.countDocuments({
//         recipient: userId,
//         isRead: false
//       });

//       return { count };
//     } catch (error) {
//       throw new AppError('UNREAD_COUNT_FETCH_FAILED', 'Failed to fetch unread count', 500);
//     }
//   }
// }

// export const notificationService = new NotificationService();
