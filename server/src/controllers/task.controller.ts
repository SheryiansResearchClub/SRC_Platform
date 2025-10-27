import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { taskService } from '@/services/task.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// POST /tasks - Create new task
const createTask = async (req: Request, res: Response) => {
  try {
    const taskData = {
      ...req.body,
      assignedBy: req.user!.role === 'admin' ? req.body.assignedBy : req.user!._id,
    };

    const task = await taskService.createTask(taskData);

    return sendSuccess(res, {
      task,
      message: 'Task created successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'TASK_CREATE_FAILED', error.message || 'Unable to create task');
  }
};

// GET /tasks - Get all tasks (with filters: project, assignee, status, priority)
const getTasks = async (req: Request, res: Response) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      project: req.query.project as string | undefined,
      assignee: req.query.assignee as string | undefined,
      reporter: req.query.reporter as string | undefined,
      status: req.query.status as string | undefined,
      priority: req.query.priority as string | undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await taskService.getTasks(query);

    return sendSuccess(res, {
      tasks: result.tasks,
      pagination: result.pagination,
      message: 'Tasks retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TASKS_FETCH_FAILED', error.message || 'Unable to fetch tasks');
  }
};

// GET /tasks/:id - Get single task details
const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id, req.user!._id.toString(), req.user!.role);

    if (!task) {
      return sendError(res, 'TASK_NOT_FOUND', 'Task not found', 404);
    }

    return sendSuccess(res, {
      task,
      message: 'Task retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TASK_FETCH_FAILED', error.message || 'Unable to fetch task');
  }
};

// PUT /tasks/:id - Update task
const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const task = await taskService.updateTask(id, updateData, req.user!._id.toString(), req.user!.role);

    if (!task) {
      return sendError(res, 'TASK_NOT_FOUND', 'Task not found', 404);
    }

    return sendSuccess(res, {
      task,
      message: 'Task updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TASK_UPDATE_FAILED', error.message || 'Unable to update task');
  }
};

// DELETE /tasks/:id - Delete task
const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await taskService.deleteTask(id, req.user!._id.toString(), req.user!.role);

    return sendSuccess(res, {
      message: 'Task deleted successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TASK_DELETE_FAILED', error.message || 'Unable to delete task');
  }
};

// PUT /tasks/:id/assign - Assign/reassign task to user
const assignTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { assignee } = req.body;

    const task = await taskService.assignTask(id, assignee, req.user!._id.toString(), req.user!.role);

    return sendSuccess(res, {
      task,
      message: 'Task assigned successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TASK_ASSIGN_FAILED', error.message || 'Unable to assign task');
  }
};

// PUT /tasks/:id/status - Update task status
const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await taskService.updateTaskStatus(id, status, req.user!._id.toString(), req.user!.role);

    return sendSuccess(res, {
      task,
      message: 'Task status updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TASK_STATUS_UPDATE_FAILED', error.message || 'Unable to update task status');
  }
};

// PUT /tasks/:id/priority - Update task priority
const updateTaskPriority = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const task = await taskService.updateTaskPriority(id, priority, req.user!._id.toString(), req.user!.role);

    return sendSuccess(res, {
      task,
      message: 'Task priority updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TASK_PRIORITY_UPDATE_FAILED', error.message || 'Unable to update task priority');
  }
};

// GET /tasks/:id/history - Get task update history
const getTaskHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const history = await taskService.getTaskHistory(id, req.user!._id.toString(), req.user!.role);

    return sendSuccess(res, {
      history,
      message: 'Task history retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TASK_HISTORY_FETCH_FAILED', error.message || 'Unable to fetch task history');
  }
};

export default {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  updateTaskPriority,
  getTaskHistory,
};
