import type { TaskDocument, TaskType } from '@/types';
import { taskRepo } from '@/repositories/task.repository';
import { projectRepo } from '@/repositories/project.repository';
import { activityLogRepo } from '@/repositories/activity-log.repository';
import { InternalServerError, NotFoundError } from '@/utils/errors';

interface TaskQuery {
  page?: number;
  limit?: number;
  project?: string;
  assignee?: string;
  assignedBy?: string;
  status?: string;
  priority?: string;
  search?: string;
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

class TaskService {
  async createTask(taskData: Partial<TaskType>): Promise<TaskDocument> {
    try {
      if (taskData.startDate && taskData.dueDate && new Date(taskData.startDate) > new Date(taskData.dueDate)) {
        throw new InternalServerError('START_DATE_CANNOT_BE_AFTER_DUE_DATE');
      }

      const task = await taskRepo.create(taskData);

      if (task.project) {
        await projectRepo.update(task.project.toString(), { $inc: { 'stats.taskCount': 1 } });
      }

      await activityLogRepo.create({
        user: taskData.assignedBy?.toString() || '',
        action: 'task_created',
        entityType: 'Task',
        entityId: task._id.toString(),
        metadata: { taskTitle: task.title }
      });

      return task;
    } catch (error) {
      throw new InternalServerError('TASK_CREATE_FAILED');
    }
  }

  async getTasks(query: TaskQuery) {
    try {
      const { tasks, totalCount } = await taskRepo.findAll(query);
      const totalPages = Math.ceil(totalCount / (query.limit || 20));
      const currentPage = query.page || 1;

      return {
        tasks,
        pagination: { currentPage, totalPages, totalCount, hasNext: currentPage < totalPages, hasPrev: currentPage > 1 } as PaginationResult
      };
    } catch (error) {
      throw new InternalServerError('TASKS_FETCH_FAILED');
    }
  }

  async getTaskById(taskId: string, userId: string, role: string): Promise<TaskDocument> {
    const task = role === 'admin'
      ? await taskRepo.findById(taskId)
      : await taskRepo.findById(taskId, userId);
    if (!task) throw new NotFoundError('TASK_NOT_FOUND');
    return task;
  }

  async updateTask(taskId: string, updateData: Partial<TaskType>, userId?: string, role?: string): Promise<TaskDocument> {
    try {
      if (updateData.startDate && updateData.dueDate && new Date(updateData.startDate) > new Date(updateData.dueDate)) {
        throw new InternalServerError('START_DATE_CANNOT_BE_AFTER_DUE_DATE');
      }

      // Check authorization if not admin
      if (role !== 'admin' && userId) {
        const existingTask = await taskRepo.findById(taskId, userId);
        if (!existingTask) throw new NotFoundError('TASK_NOT_FOUND');
      }

      const task = await taskRepo.update(taskId, updateData);

      if (!task) throw new NotFoundError('TASK_NOT_FOUND');

      if (updateData.status) {
        await activityLogRepo.create({
          user: String(task.assignee?._id || task.assignedBy?._id || ''),
          action: 'task_status_updated',
          entityType: 'Task',
          entityId: task._id.toString(),
          metadata: { status: updateData.status }
        });
      }

      return task;
    } catch (error) {
      throw new InternalServerError('TASK_UPDATE_FAILED');
    }
  }

  async deleteTask(taskId: string, userId: string, role: string): Promise<void> {
    let task: TaskDocument | null = null;

    // Check authorization if not admin
    if (role !== 'admin') {
      task = await taskRepo.findById(taskId, userId);
      if (!task) throw new NotFoundError('TASK_NOT_FOUND');
    } else {
      // For admin, just verify task exists
      task = await taskRepo.findById(taskId);
      if (!task) throw new NotFoundError('TASK_NOT_FOUND');
    }

    await taskRepo.delete(taskId);

    if (task.project) {
      const completedCount = task.status === 'done' ? -1 : 0;
      await projectRepo.update(task.project?._id.toString(), { $inc: { 'stats.taskCount': -1, 'stats.completedTaskCount': completedCount } });
    }

    await activityLogRepo.create({
      user: String(task.assignedBy?._id || ""),
      action: 'task_deleted',
      entityType: 'Task',
      entityId: task._id.toString(),
      metadata: { assigneeId: String(task.assignee?._id || "") }
    });
  }

  async assignTask(taskId: string, assigneeId: string, userId: string, role: string): Promise<TaskDocument> {
    if (role !== 'admin') {
      const existingTask = await taskRepo.findById(taskId, userId);
      if (!existingTask) throw new NotFoundError('TASK_NOT_FOUND');
    } else {
      const existingTask = await taskRepo.findById(taskId);
      if (!existingTask) throw new NotFoundError('TASK_NOT_FOUND');
    }

    const task = await taskRepo.assignTask(taskId, assigneeId);
    if (!task) throw new NotFoundError('TASK_NOT_FOUND');

    await activityLogRepo.create({
      user: String(assigneeId),
      action: 'task_assigned',
      entityType: 'Task',
      entityId: taskId,
      metadata: { assignedById: String(task.assignedBy?._id || "") }
    });

    return task;
  }

  async updateTaskStatus(taskId: string, status: string, userId: string, role: string): Promise<TaskDocument> {
    const updateData: Partial<TaskType> = {
      status: status as any,
      completedAt: status === 'done' ? new Date() : undefined
    };

    const task = await this.updateTask(taskId, updateData, userId, role);

    if (task?.project && status === 'done') {
      await projectRepo.update(String(task.project._id), { $inc: { 'stats.completedTaskCount': 1 } });
    }

    return task;
  }

  async updateTaskPriority(taskId: string, priority: string, userId: string, role: string): Promise<TaskDocument> {
    return await this.updateTask(taskId, { priority: priority as any }, userId, role);
  }

  async getTaskHistory(taskId: string, userId: string, role: string) {
    const task = role === 'admin'
      ? await taskRepo.findById(taskId)
      : await taskRepo.findById(taskId, userId);
    if (!task) throw new NotFoundError('TASK_NOT_FOUND');

    return await activityLogRepo.getEntityHistory('Task', taskId);
  }
}

export const taskService = new TaskService();