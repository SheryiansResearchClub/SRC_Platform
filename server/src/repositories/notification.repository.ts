// import { Schema, model, Types } from 'mongoose';
// import type { HydratedDocument, InferSchemaType } from 'mongoose';
// import { Notification, NotificationDocument } from '../models/notification.model';

// class NotificationRepository {
//   async create(notificationData: {
//     user: Types.ObjectId;
//     type: 'task' | 'comment' | 'project' | 'system' | 'event' | 'mention' | 'deadline';
//     title: string;
//     message: string;
//     payload?: any;
//     channel?: 'in-app' | 'email' | 'push';
//     actionUrl?: string;
//     actionText?: string;
//     priority?: 'low' | 'medium' | 'high';
//     expiresAt?: Date;
//   }): Promise<NotificationDocument> {
//     const notification = await Notification.create(notificationData);
//     return notification as NotificationDocument;
//   }

//   async findById(notificationId: string): Promise<NotificationDocument | null> {
//     return await Notification.findById(notificationId)
//       .populate('user', 'name email avatarUrl')
//       .exec() as NotificationDocument | null;
//   }

//   async findByUser(userId: string, options: {
//     read?: boolean;
//     type?: string;
//     priority?: string;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<NotificationDocument[]> {
//     const {
//       read,
//       type,
//       priority,
//       page = 1,
//       limit = 20,
//       sort = '-createdAt'
//     } = options;

//     const query: any = { user: userId };

//     if (read !== undefined) query.read = read;
//     if (type) query.type = type;
//     if (priority) query.priority = priority;

//     return await Notification.find(query)
//       .populate('user', 'name email avatarUrl')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as NotificationDocument[];
//   }

//   async markAsRead(notificationId: string): Promise<NotificationDocument | null> {
//     return await Notification.findByIdAndUpdate(
//       notificationId,
//       {
//         read: true,
//         readAt: new Date()
//       },
//       { new: true }
//     )
//       .populate('user', 'name email avatarUrl')
//       .exec() as NotificationDocument | null;
//   }

//   async markAllAsRead(userId: string): Promise<number> {
//     const result = await Notification.updateMany(
//       { user: userId, read: false },
//       {
//         read: true,
//         readAt: new Date()
//       }
//     );
//     return result.modifiedCount;
//   }

//   async delete(notificationId: string): Promise<void> {
//     await Notification.findByIdAndDelete(notificationId);
//   }

//   async countUnreadByUser(userId: string): Promise<number> {
//     return await Notification.countDocuments({ user: userId, read: false });
//   }

//   async bulkCreate(notifications: Array<{
//     user: string;
//     type: 'task' | 'comment' | 'project' | 'system' | 'event' | 'mention' | 'deadline';
//     title: string;
//     message: string;
//     payload?: any;
//     channel?: 'in-app' | 'email' | 'push';
//     actionUrl?: string;
//     actionText?: string;
//     priority?: 'low' | 'medium' | 'high';
//     expiresAt?: Date;
//   }>): Promise<NotificationDocument[]> {
//     const createdNotifications = await Notification.insertMany(
//       notifications.map(n => ({ ...n, user: new Types.ObjectId(n.user) }))
//     );
//     return createdNotifications as NotificationDocument[];
//   }
// }

// export const notificationRepo = new NotificationRepository();
