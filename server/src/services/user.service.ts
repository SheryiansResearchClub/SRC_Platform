import type { UserDocument } from '@/types';
import { userRepo } from '@/repositories/user.repository';
import { projectRepo } from '@/repositories/project.repository';
import { taskRepo } from '@/repositories/task.repository';
import { badgeRepo } from '@/repositories/badge.repository';
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/utils/errors';

interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UserStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  onTimeCompletionRate: number;
  points: number;
  badges: string[];
  achievements: string[];
  activityStreak: number;
  joinDate: Date;
  lastActive: Date;
}

class UserService {
  private userRepo = userRepo;

  async createUser(data: {
    name: string;
    email: string;
    password?: string;
    role?: string;
    avatarUrl?: string;
    bio?: string;
    skills?: string[];
  }): Promise<UserDocument> {

    const emailExists = await this.userRepo.emailExists(data.email);
    if (emailExists) {
      throw new Error('Email already exists');
    }

    const user = await this.userRepo.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'member',
      avatarUrl: data.avatarUrl,
      bio: data.bio,
      skills: data.skills || [],
    });

    return user;
  }

  async getUsers(query: GetUsersQuery): Promise<{
    users: UserDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const skip = (page - 1) * limit;

    let searchQuery: any = {};
    if (search) {
      searchQuery.$text = { $search: search };
    }

    if (role) {
      searchQuery.role = role;
    }

    if (status) {
      searchQuery.status = status;
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await this.userRepo.findUsersWithPagination(
      searchQuery,
      skip,
      limit,
      sort
    );

    const total = await this.userRepo.countUsers(searchQuery);
    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      totalPages
    };
  }

  async getUserById(userId: string): Promise<UserDocument> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateUser(userId: string, data: Partial<UserDocument>, currentUser?: UserDocument): Promise<UserDocument> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (currentUser && currentUser._id.toString() !== userId && !['admin', 'moderator'].includes(currentUser.role)) {
      throw new ForbiddenError('You can only update your own profile');
    }
    if (data.email && data.email !== user.email) {
      const emailExists = await this.userRepo.emailExists(data.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    const updatedUser = await this.userRepo.update(userId, data);
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;
  }

  async deleteUser(userId: string, currentUser: UserDocument): Promise<void> {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenError('Only administrators can delete users');
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (currentUser._id.toString() === userId) {
      throw new Error('You cannot delete your own account');
    }

    await this.userRepo.deleteUser(userId);
  }

  async updateUserRole(userId: string, role: string, currentUser: UserDocument): Promise<UserDocument> {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenError('Only administrators can update user roles');
    }

    if (!['member', 'moderator', 'admin'].includes(role)) {
      throw new Error('Invalid role');
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await this.userRepo.update(userId, { role } as Partial<UserDocument>);
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;
  }

  async updateUserProfile(userId: string, data: {
    name?: string;
    avatarUrl?: string;
    bio?: string;
    skills?: string[];
  }, currentUser: UserDocument): Promise<UserDocument> {
    if (currentUser._id.toString() !== userId) {
      throw new ForbiddenError('You can only update your own profile');
    }

    return this.updateUser(userId, data, currentUser);
  }

  async updateUserPassword(userId: string, data: {
    currentPassword: string;
    newPassword: string;
  }, currentUser: UserDocument): Promise<void> {
    if (currentUser._id.toString() !== userId) {
      throw new ForbiddenError('You can only update your own password');
    }

    const user = await this.userRepo.findByEmailWithPassword(currentUser.email);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const isPasswordValid = await user.comparePassword(data.currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    if (data.newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    user.password = data.newPassword;
    await user.save();

    await this.userRepo.removeAllRefreshTokens(userId);
  }

  async getUserProjects(userId: string): Promise<any[]> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const projects = await projectRepo.findByUserId(userId);

    return projects.map((project: any) => ({
      id: project._id.toString(),
      name: project.name,
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      role: project.members.find((member: any) => member.user.toString() === userId)?.role || 'member',
      joinedAt: project.members.find((member: any) => member.user.toString() === userId)?.joinedAt,
      updatedAt: project.updatedAt,
    }));
  }

  async getUserTasks(userId: string): Promise<any[]> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const tasks = await taskRepo.findByUserId(userId);

    return tasks.map((task: any) => ({
      id: task._id.toString(),
      title: task.title,
      status: task.status,
      priority: task.priority,
      type: task.type,
      dueDate: task.dueDate,
      completedAt: task.completedAt,
      project: task.project ? {
        id: task.project._id.toString(),
        name: task.project.name,
        status: task.project.status,
      } : null,
      isAssignee: task.assignee?.toString() === userId,
      isReporter: task.reporter.toString() === userId,
    }));
  }

  async getUserStatistics(userId: string): Promise<UserStats> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const [totalProjects, totalTasks, completedTasks] = await Promise.all([
      projectRepo.countByUserId(userId),
      taskRepo.countByUserId(userId),
      taskRepo.countCompletedByUserId(userId)
    ]);

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      onTimeCompletionRate: user.onTimeCompletionRate,
      points: user.points,
      badges: user.badges?.map((badge: any) => badge.toString()) || [],
      achievements: user.achievements || [],
      activityStreak: user.activityStreak,
      joinDate: user.createdAt!,
      lastActive: user.lastActiveAt || user.createdAt!,
    };
  }

  async getUserAchievements(userId: string): Promise<{
    badges: any[];
    achievements: string[];
    points: number;
    activityStreak: number;
  }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const badges = user.badges && user.badges.length > 0
      ? await badgeRepo.findByIds(user.badges.map((badge: any) => badge.toString()))
      : [];

    return {
      badges: badges.map((badge: any) => ({
        id: badge._id.toString(),
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        rarity: badge.rarity,
        points: badge.points,
        earnedAt: badge.createdAt || user.createdAt || new Date(),
      })),
      achievements: user.achievements || [],
      points: user.points,
      activityStreak: user.activityStreak,
    };
  }

  async updateUserStats(userId: string, stats: {
    projectCount?: number;
    taskCount?: number;
    completedTaskCount?: number;
    onTimeCompletionRate?: number;
    points?: number;
    badges?: string[];
    achievements?: string[];
    activityStreak?: number;
  }): Promise<UserDocument> {
    const updateData: Partial<UserDocument> = {};

    if (stats.projectCount !== undefined) updateData.projectCount = stats.projectCount;
    if (stats.taskCount !== undefined) updateData.taskCount = stats.taskCount;
    if (stats.completedTaskCount !== undefined) updateData.completedTaskCount = stats.completedTaskCount;
    if (stats.onTimeCompletionRate !== undefined) updateData.onTimeCompletionRate = stats.onTimeCompletionRate;
    if (stats.points !== undefined) updateData.points = stats.points;
    if (stats.badges !== undefined) updateData.badges = stats.badges.map(badge => ({ _id: badge })) as any;
    if (stats.achievements !== undefined) updateData.achievements = stats.achievements;
    if (stats.activityStreak !== undefined) updateData.activityStreak = stats.activityStreak;

    const user = await this.userRepo.update(userId, updateData);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}

export const userService = new UserService();
