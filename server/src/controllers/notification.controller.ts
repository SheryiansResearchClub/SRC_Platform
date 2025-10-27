import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { notificationService } from '@/services/notification.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// POST /notifications - Create notification (system-generated)
const createNotification = async (req: Request, res: Response) => {
  try {
    const notificationData = {
      ...req.body,
      createdBy: req.user?._id || 'system',
    };

    const notification = await notificationService.createNotification(notificationData);

    return sendSuccess(res, {
      notification,
      message: 'Notification created successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'NOTIFICATION_CREATE_FAILED', error.message || 'Unable to create notification');
  }
};

// GET /notifications - Get user notifications
const getNotifications = async (req: Request, res: Response) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      type: req.query.type as string | undefined,
      read: req.query.read as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await notificationService.getNotifications(req.user!._id, query);

    return sendSuccess(res, {
      notifications: result.notifications,
      pagination: result.pagination,
      message: 'Notifications retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'NOTIFICATIONS_FETCH_FAILED', error.message || 'Unable to fetch notifications');
  }
};

// GET /notifications/:id - Get single notification
const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.getNotificationById(id);

    if (!notification) {
      return sendError(res, 'NOTIFICATION_NOT_FOUND', 'Notification not found', 404);
    }

    return sendSuccess(res, {
      notification,
      message: 'Notification retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'NOTIFICATION_FETCH_FAILED', error.message || 'Unable to fetch notification');
  }
};

// PUT /notifications/:id/read - Mark notification as read
const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id, req.user!._id);

    return sendSuccess(res, {
      notification,
      message: 'Notification marked as read successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'NOTIFICATION_MARK_READ_FAILED', error.message || 'Unable to mark notification as read');
  }
};

// PUT /notifications/read-all - Mark all notifications as read
const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const count = await notificationService.markAllAsRead(req.user!._id);

    return sendSuccess(res, {
      count,
      message: 'All notifications marked as read successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'NOTIFICATIONS_MARK_ALL_READ_FAILED', error.message || 'Unable to mark all notifications as read');
  }
};

// DELETE /notifications/:id - Delete notification
const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await notificationService.deleteNotification(id);

    return sendSuccess(res, {
      message: 'Notification deleted successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'NOTIFICATION_DELETE_FAILED', error.message || 'Unable to delete notification');
  }
};

// GET /notifications/unread-count - Get unread notification count
const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const count = await notificationService.getUnreadCount(req.user!._id);

    return sendSuccess(res, {
      count,
      message: 'Unread notification count retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'UNREAD_COUNT_FETCH_FAILED', error.message || 'Unable to fetch unread notification count');
  }
};

export default {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
