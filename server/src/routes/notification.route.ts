// import express from 'express';
// import notificationController from '@/controllers/notification.controller';
// import validators from '@/middleware/validators';
// import { isAuthenticate } from '@/middleware/auth/isAuthenticate';
// import { authorize } from '@/middleware/auth/authorize';
// import { apiRateLimiters } from '@/middleware/rate-limit';

// const router = express.Router();

// // All notification routes require authentication
// router.use(isAuthenticate);

// // POST /notifications - Create notification (system-generated)
// router.post(
//   '/',
//   authorize('admin'), // Only admins can create notifications
//   validators.createUserValidation, // Using existing validation for now
//   notificationController.createNotification
// );

// // GET /notifications - Get user notifications
// router.get(
//   '/',
//   validators.getUsersValidation, // Using existing validation for now
//   notificationController.getNotifications
// );

// // GET /notifications/:id - Get single notification
// router.get(
//   '/:id',
//   notificationController.getNotificationById
// );

// // PUT /notifications/:id/read - Mark notification as read
// router.put(
//   '/:id/read',
//   notificationController.markAsRead
// );

// // PUT /notifications/read-all - Mark all notifications as read
// router.put(
//   '/read-all',
//   notificationController.markAllAsRead
// );

// // DELETE /notifications/:id - Delete notification
// router.delete(
//   '/:id',
//   notificationController.deleteNotification
// );

// // GET /notifications/unread-count - Get unread notification count
// router.get(
//   '/unread-count',
//   notificationController.getUnreadCount
// );

// export default router;
