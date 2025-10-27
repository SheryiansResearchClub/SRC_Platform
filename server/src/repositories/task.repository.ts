import type { TaskDocument, TaskType } from "@/types"
import { Task } from '@/models/task.model';

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

class TaskRepository {
  async create(taskData: Partial<TaskType>): Promise<TaskDocument> {
    const task = new Task(taskData);
    return await task.save();
  }

  async findAll(query: TaskQuery): Promise<{ tasks: TaskDocument[]; totalCount: number }> {
    const { page = 1, limit = 20, project, assignee, assignedBy, status, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (project) filter.project = project;
    if (assignee) filter.assignee = assignee;
    if (assignedBy) filter.assignedBy = assignedBy;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.$text = { $search: search };

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [tasks, totalCount] = await Promise.all([
      Task.find(filter)
        .populate('project', 'title status')
        .populate('assignee', 'name email avatarUrl')
        .populate('assignedBy', 'name email avatarUrl')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      Task.countDocuments(filter)
    ]);

    return { tasks, totalCount };
  }

  async findById(taskId: string, userId?: string): Promise<TaskDocument | null> {
    const filter: any = { _id: taskId };
    if (userId) {
      filter.assignedBy = userId;
    }
    return await Task.findOne(filter)
      .populate('project', 'title status')
      .populate('assignee', 'name email avatarUrl')
      .populate('assignedBy', 'name email avatarUrl')
      .exec();
  }

  async update(taskId: string, updateData: Partial<TaskType>): Promise<TaskDocument | null> {
    return await Task.findByIdAndUpdate(taskId, updateData, { new: true })
      .populate('project', 'title status')
      .populate('assignee', 'name email avatarUrl')
      .populate('assignedBy', 'name email avatarUrl')
      .exec();
  }

  async delete(taskId: string): Promise<void> {
    await Task.findByIdAndDelete(taskId);
  }

  async assignTask(taskId: string, assigneeId: string): Promise<TaskDocument | null> {
    return await Task.findByIdAndUpdate(
      taskId,
      { assignee: assigneeId, assignedAt: new Date() },
      { new: true }
    )
      .populate('project', 'title status')
      .populate('assignee', 'name email avatarUrl')
      .populate('assignedBy', 'name email avatarUrl')
      .exec();
  }

  async findByProject(projectId: string): Promise<TaskDocument[]> {
    return await Task.find({ project: projectId })
      .populate('assignee', 'name email avatarUrl')
      .populate('assignedBy', 'name email avatarUrl')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findByUserId(userId: string): Promise<TaskDocument[]> {
    return await Task.find({
      $or: [
        { assignee: userId },
        { assignedBy: userId }
      ]
    })
      .populate('assignee', 'name email avatarUrl')
      .populate('assignedBy', 'name email avatarUrl')
      .populate('project', 'title status')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async countByUserId(userId: string): Promise<number> {
    return await Task.countDocuments({ assignee: userId });
  }

  async countCompletedByUserId(userId: string): Promise<number> {
    return await Task.countDocuments({ assignee: userId, status: 'done' });
  }
}

export const taskRepo = new TaskRepository();