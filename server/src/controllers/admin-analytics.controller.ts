import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { analyticsService } from '@/services/analytics.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// GET /admin/analytics/overview - Get overall platform statistics
const getOverview = async (req: Request, res: Response) => {
  try {
    const overview = await analyticsService.getOverview();

    return sendSuccess(res, {
      overview,
      message: 'Platform overview retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'OVERVIEW_FETCH_FAILED', error.message || 'Unable to fetch platform overview');
  }
};

// GET /admin/analytics/members - Get member activity analytics
const getMemberAnalytics = async (req: Request, res: Response) => {
  try {
    const { period = '30d' } = req.query;
    const analytics = await analyticsService.getMemberAnalytics(period as string);

    return sendSuccess(res, {
      analytics,
      message: 'Member analytics retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MEMBER_ANALYTICS_FETCH_FAILED', error.message || 'Unable to fetch member analytics');
  }
};

// GET /admin/analytics/projects - Get project completion rates
const getProjectAnalytics = async (req: Request, res: Response) => {
  try {
    const { period = '30d' } = req.query;
    const analytics = await analyticsService.getProjectAnalytics(period as string);

    return sendSuccess(res, {
      analytics,
      message: 'Project analytics retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'PROJECT_ANALYTICS_FETCH_FAILED', error.message || 'Unable to fetch project analytics');
  }
};

// GET /admin/analytics/tasks - Get task completion analytics
const getTaskAnalytics = async (req: Request, res: Response) => {
  try {
    const { period = '30d' } = req.query;
    const analytics = await analyticsService.getTaskAnalytics(period as string);

    return sendSuccess(res, {
      analytics,
      message: 'Task analytics retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TASK_ANALYTICS_FETCH_FAILED', error.message || 'Unable to fetch task analytics');
  }
};

// GET /admin/analytics/engagement - Get user engagement metrics
const getEngagementAnalytics = async (req: Request, res: Response) => {
  try {
    const { period = '30d' } = req.query;
    const analytics = await analyticsService.getEngagementAnalytics(period as string);

    return sendSuccess(res, {
      analytics,
      message: 'Engagement analytics retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'ENGAGEMENT_ANALYTICS_FETCH_FAILED', error.message || 'Unable to fetch engagement analytics');
  }
};

// GET /admin/analytics/deadlines - Get deadline tracking data
const getDeadlineAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = await analyticsService.getDeadlineAnalytics();

    return sendSuccess(res, {
      analytics,
      message: 'Deadline analytics retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'DEADLINE_ANALYTICS_FETCH_FAILED', error.message || 'Unable to fetch deadline analytics');
  }
};

export default {
  getOverview,
  getMemberAnalytics,
  getProjectAnalytics,
  getTaskAnalytics,
  getEngagementAnalytics,
  getDeadlineAnalytics,
};
