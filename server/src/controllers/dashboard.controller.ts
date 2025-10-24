import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { dashboardService } from '@/services/dashboard.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// GET /dashboard - Get user dashboard overview
const getDashboard = async (req: Request, res: Response) => {
  try {
    const dashboard = await dashboardService.getUserDashboard(req.user!._id);

    return sendSuccess(res, {
      dashboard,
      message: 'Dashboard retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'DASHBOARD_FETCH_FAILED', error.message || 'Unable to fetch dashboard');
  }
};

// GET /dashboard/projects - Get user's ongoing projects
const getUserProjects = async (req: Request, res: Response) => {
  try {
    const projects = await dashboardService.getUserProjects(req.user!._id);

    return sendSuccess(res, {
      projects,
      message: 'User projects retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_PROJECTS_FETCH_FAILED', error.message || 'Unable to fetch user projects');
  }
};

// GET /dashboard/tasks/due-today - Get tasks due today
const getTasksDueToday = async (req: Request, res: Response) => {
  try {
    const tasks = await dashboardService.getTasksDueToday(req.user!._id);

    return sendSuccess(res, {
      tasks,
      message: 'Tasks due today retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TASKS_DUE_TODAY_FETCH_FAILED', error.message || 'Unable to fetch tasks due today');
  }
};

// GET /dashboard/tasks/urgent - Get urgent/overdue tasks
const getUrgentTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await dashboardService.getUrgentTasks(req.user!._id);

    return sendSuccess(res, {
      tasks,
      message: 'Urgent tasks retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'URGENT_TASKS_FETCH_FAILED', error.message || 'Unable to fetch urgent tasks');
  }
};

// GET /dashboard/messages - Get unread messages count
const getUnreadMessagesCount = async (req: Request, res: Response) => {
  try {
    const count = await dashboardService.getUnreadMessagesCount(req.user!._id);

    return sendSuccess(res, {
      count,
      message: 'Unread messages count retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'UNREAD_MESSAGES_FETCH_FAILED', error.message || 'Unable to fetch unread messages count');
  }
};

// GET /dashboard/activity - Get recent activity feed
const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const activities = await dashboardService.getRecentActivity(req.user!._id);

    return sendSuccess(res, {
      activities,
      message: 'Recent activity retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'ACTIVITY_FETCH_FAILED', error.message || 'Unable to fetch recent activity');
  }
};

export default {
  getDashboard,
  getUserProjects,
  getTasksDueToday,
  getUrgentTasks,
  getUnreadMessagesCount,
  getRecentActivity,
};
