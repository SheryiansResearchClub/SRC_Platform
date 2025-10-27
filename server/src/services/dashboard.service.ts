// import { User, Project, Task, Comment, ActivityLog } from '@/models';
// import { commentRepo } from '@/repositories/comment.repository';
// import { projectRepo } from '@/repositories/project.repository';
// import { taskRepo } from '@/repositories/task.repository';
// import { activityLogRepo } from '@/repositories/activity-log.repository';
// import { AppError } from '@/utils/errors';

// interface DashboardData {
//   recentProjects: Project[];
//   upcomingTasks: Task[];
//   recentComments: Comment[];
//   recentActivity: ActivityLog[];
//   stats: {
//     totalProjects: number;
//     totalTasks: number;
//     completedTasks: number;
//     overdueTasks: number;
//   };
// }

// interface UserProjects {
//   projects: Array<{
//     _id: string;
//     title: string;
//     status: string;
//     priority: string;
//     progress: number;
//     dueDate?: Date;
//     role: string;
//   }>;
// }

// interface TasksDueToday {
//   tasks: Task[];
// }

// interface UrgentTasks {
//   tasks: Task[];
// }

// class DashboardService {
//   async getUserDashboard(userId: string): Promise<DashboardData> {
//     try {
//       const [
//         recentProjects,
//         upcomingTasks,
//         recentComments,
//         recentActivity,
//         stats
//       ] = await Promise.all([
//         this.getUserProjectsData(userId),
//         this.getUpcomingTasks(userId),
//         this.getRecentComments(userId),
//         this.getRecentActivity(userId),
//         this.getUserStats(userId)
//       ]);

//       return {
//         recentProjects,
//         upcomingTasks,
//         recentComments,
//         recentActivity,
//         stats
//       };
//     } catch (error) {
//       throw new AppError('DASHBOARD_FETCH_FAILED', 'Failed to fetch dashboard data', 500);
//     }
//   }

//   async getUserProjects(userId: string): Promise<UserProjects> {
//     try {
//       const projects = await projectRepo.getUserProjects(userId);

//       const formattedProjects = projects.map(project => ({
//         _id: project._id,
//         title: project.title,
//         status: project.status,
//         priority: project.priority,
//         progress: this.calculateProjectProgress(project),
//         dueDate: project.endDate,
//         role: this.getUserRoleInProject(userId, project)
//       }));

//       return {
//         projects: formattedProjects
//       };
//     } catch (error) {
//       throw new AppError('USER_PROJECTS_FETCH_FAILED', 'Failed to fetch user projects', 500);
//     }
//   }

//   async getTasksDueToday(userId: string): Promise<TasksDueToday> {
//     try {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const tomorrow = new Date(today);
//       tomorrow.setDate(tomorrow.getDate() + 1);

//       const tasks = await taskRepo.getUserTasks(userId, {
//         dueDate: {
//           $gte: today,
//           $lt: tomorrow
//         },
//         status: { $ne: 'completed' }
//       });

//       return {
//         tasks
//       };
//     } catch (error) {
//       throw new AppError('TASKS_DUE_TODAY_FETCH_FAILED', 'Failed to fetch tasks due today', 500);
//     }
//   }

//   async getUrgentTasks(userId: string): Promise<UrgentTasks> {
//     try {
//       const now = new Date();

//       const tasks = await taskRepo.getUserTasks(userId, {
//         $or: [
//           { dueDate: { $lt: now }, status: { $ne: 'completed' } },
//           { priority: 'urgent', status: { $ne: 'completed' } },
//           { priority: 'high', status: { $ne: 'completed' } }
//         ]
//       });

//       return {
//         tasks
//       };
//     } catch (error) {
//       throw new AppError('URGENT_TASKS_FETCH_FAILED', 'Failed to fetch urgent tasks', 500);
//     }
//   }

//   async getUnreadMessagesCount(userId: string): Promise<{ count: number }> {
//     try {
//       // This would need a Message model - for now returning 0
//       const count = 0;

//       return {
//         count
//       };
//     } catch (error) {
//       throw new AppError('UNREAD_MESSAGES_FETCH_FAILED', 'Failed to fetch unread messages count', 500);
//     }
//   }

//   async getRecentActivity(userId: string): Promise<{ activities: ActivityLog[] }> {
//     try {
//       const activities = await activityLogRepo.getUserActivity(userId, {
//         page: 1,
//         limit: 20
//       });

//       return {
//         activities
//       };
//     } catch (error) {
//       throw new AppError('ACTIVITY_FETCH_FAILED', 'Failed to fetch recent activity', 500);
//     }
//   }

//   private async getUserProjectsData(userId: string): Promise<Project[]> {
//     try {
//       return await projectRepo.getUserProjects(userId);
//     } catch (error) {
//       return [];
//     }
//   }

//   private async getUpcomingTasks(userId: string): Promise<Task[]> {
//     try {
//       const now = new Date();
//       const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

//       const tasks = await taskRepo.getUserTasks(userId, {
//         dueDate: { $gte: now, $lte: weekFromNow },
//         status: { $ne: 'completed' }
//       });

//       return tasks.sort((a, b) => {
//         if (!a.dueDate) return 1;
//         if (!b.dueDate) return -1;
//         return a.dueDate.getTime() - b.dueDate.getTime();
//       }).slice(0, 10);
//     } catch (error) {
//       return [];
//     }
//   }

//   private async getRecentComments(userId: string): Promise<Comment[]> {
//     try {
//       const comments = await commentRepo.getCommentsByAuthor(userId, {
//         page: 1,
//         limit: 10
//       });

//       return comments;
//     } catch (error) {
//       return [];
//     }
//   }

//   private async getRecentActivity(userId: string): Promise<ActivityLog[]> {
//     try {
//       return await activityLogRepo.getUserActivity(userId, {
//         page: 1,
//         limit: 20
//       });
//     } catch (error) {
//       return [];
//     }
//   }

//   private async getUserStats(userId: string): Promise<{
//     totalProjects: number;
//     totalTasks: number;
//     completedTasks: number;
//     overdueTasks: number;
//   }> {
//     try {
//       const [totalProjects, totalTasks, completedTasks, overdueTasks] = await Promise.all([
//         projectRepo.countUserProjects(userId),
//         taskRepo.countUserTasks(userId),
//         taskRepo.countUserTasks(userId, { status: 'completed' }),
//         taskRepo.countUserTasks(userId, {
//           dueDate: { $lt: new Date() },
//           status: { $ne: 'completed' }
//         })
//       ]);

//       return {
//         totalProjects,
//         totalTasks,
//         completedTasks,
//         overdueTasks
//       };
//     } catch (error) {
//       return {
//         totalProjects: 0,
//         totalTasks: 0,
//         completedTasks: 0,
//         overdueTasks: 0
//       };
//     }
//   }

//   private calculateProjectProgress(project: Project): number {
//     try {
//       // This would need a more sophisticated calculation based on tasks
//       const statusProgress: { [key: string]: number } = {
//         'planning': 10,
//         'ongoing': 50,
//         'completed': 100,
//         'on-hold': 25,
//         'cancelled': 0
//       };

//       return statusProgress[project.status] || 0;
//     } catch (error) {
//       return 0;
//     }
//   }

//   private getUserRoleInProject(userId: string, project: Project): string {
//     try {
//       // This would need to check the project members array
//       if (project.createdBy?.toString() === userId.toString()) {
//         return 'owner';
//       }

//       // For now, assuming member role
//       return 'member';
//     } catch (error) {
//       return 'member';
//     }
//   }
// }

// export const dashboardService = new DashboardService();
