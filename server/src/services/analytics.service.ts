// import { User, Project, Task, Comment, ActivityLog } from '@/models';
// import { AppError } from '@/utils/errors';

// interface OverviewData {
//   totalUsers: number;
//   totalProjects: number;
//   totalTasks: number;
//   totalComments: number;
//   activeProjects: number;
//   completedTasks: number;
//   pendingComments: number;
//   recentActivity: ActivityLog[];
// }

// interface MemberAnalytics {
//   totalMembers: number;
//   newMembersThisMonth: number;
//   activeMembers: number;
//   memberGrowth: Array<{
//     date: string;
//     count: number;
//   }>;
// }

// interface ProjectAnalytics {
//   totalProjects: number;
//   completedProjects: number;
//   ongoingProjects: number;
//   completionRate: number;
//   averageProjectDuration: number;
//   projectsByType: Array<{
//     type: string;
//     count: number;
//   }>;
// }

// interface TaskAnalytics {
//   totalTasks: number;
//   completedTasks: number;
//   overdueTasks: number;
//   completionRate: number;
//   averageTaskDuration: number;
//   tasksByPriority: Array<{
//     priority: string;
//     count: number;
//   }>;
// }

// interface EngagementAnalytics {
//   dailyActiveUsers: number;
//   weeklyActiveUsers: number;
//   monthlyActiveUsers: number;
//   commentsPerDay: number;
//   projectsPerUser: number;
//   tasksPerUser: number;
// }

// interface DeadlineAnalytics {
//   totalDeadlines: number;
//   upcomingDeadlines: number;
//   overdueDeadlines: number;
//   deadlinesThisWeek: Array<{
//     title: string;
//     dueDate: Date;
//     project: string;
//   }>;
// }

// class AnalyticsService {
//   async getOverview(): Promise<OverviewData> {
//     try {
//       const [
//         totalUsers,
//         totalProjects,
//         totalTasks,
//         totalComments,
//         activeProjects,
//         completedTasks,
//         pendingComments,
//         recentActivity
//       ] = await Promise.all([
//         User.countDocuments(),
//         Project.countDocuments(),
//         Task.countDocuments(),
//         Comment.countDocuments(),
//         Project.countDocuments({ status: 'ongoing' }),
//         Task.countDocuments({ status: 'completed' }),
//         Comment.countDocuments({ status: 'pending' }),
//         ActivityLog.find()
//           .sort({ createdAt: -1 })
//           .limit(10)
//           .populate('user', 'name email')
//           .exec()
//       ]);

//       return {
//         totalUsers,
//         totalProjects,
//         totalTasks,
//         totalComments,
//         activeProjects,
//         completedTasks,
//         pendingComments,
//         recentActivity: recentActivity as ActivityLog[]
//       };
//     } catch (error) {
//       throw new AppError('OVERVIEW_FETCH_FAILED', 'Failed to fetch overview data', 500);
//     }
//   }

//   async getMemberAnalytics(period: string): Promise<MemberAnalytics> {
//     try {
//       const now = new Date();
//       const periodStart = new Date();

//       switch (period) {
//         case '7d':
//           periodStart.setDate(now.getDate() - 7);
//           break;
//         case '30d':
//           periodStart.setDate(now.getDate() - 30);
//           break;
//         case '90d':
//           periodStart.setDate(now.getDate() - 90);
//           break;
//         default:
//           periodStart.setDate(now.getDate() - 30);
//       }

//       const [totalMembers, newMembersThisMonth, activeMembers, memberGrowth] = await Promise.all([
//         User.countDocuments(),
//         User.countDocuments({ createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } }),
//         User.countDocuments({ lastActive: { $gte: periodStart } }),
//         this.getMemberGrowthData(period)
//       ]);

//       return {
//         totalMembers,
//         newMembersThisMonth,
//         activeMembers,
//         memberGrowth
//       };
//     } catch (error) {
//       throw new AppError('MEMBER_ANALYTICS_FETCH_FAILED', 'Failed to fetch member analytics', 500);
//     }
//   }

//   async getProjectAnalytics(period: string): Promise<ProjectAnalytics> {
//     try {
//       const [totalProjects, completedProjects, ongoingProjects, projectsByType] = await Promise.all([
//         Project.countDocuments(),
//         Project.countDocuments({ status: 'completed' }),
//         Project.countDocuments({ status: 'ongoing' }),
//         Project.aggregate([
//           { $group: { _id: '$type', count: { $sum: 1 } } },
//           { $project: { type: '$_id', count: 1, _id: 0 } }
//         ])
//       ]);

//       const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
//       const averageProjectDuration = await this.getAverageProjectDuration();

//       return {
//         totalProjects,
//         completedProjects,
//         ongoingProjects,
//         completionRate,
//         averageProjectDuration,
//         projectsByType
//       };
//     } catch (error) {
//       throw new AppError('PROJECT_ANALYTICS_FETCH_FAILED', 'Failed to fetch project analytics', 500);
//     }
//   }

//   async getTaskAnalytics(period: string): Promise<TaskAnalytics> {
//     try {
//       const [totalTasks, completedTasks, overdueTasks, tasksByPriority] = await Promise.all([
//         Task.countDocuments(),
//         Task.countDocuments({ status: 'completed' }),
//         Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: 'completed' } }),
//         Task.aggregate([
//           { $group: { _id: '$priority', count: { $sum: 1 } } },
//           { $project: { priority: '$_id', count: 1, _id: 0 } }
//         ])
//       ]);

//       const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
//       const averageTaskDuration = await this.getAverageTaskDuration();

//       return {
//         totalTasks,
//         completedTasks,
//         overdueTasks,
//         completionRate,
//         averageTaskDuration,
//         tasksByPriority
//       };
//     } catch (error) {
//       throw new AppError('TASK_ANALYTICS_FETCH_FAILED', 'Failed to fetch task analytics', 500);
//     }
//   }

//   async getEngagementAnalytics(period: string): Promise<EngagementAnalytics> {
//     try {
//       const periodStart = new Date();
//       const weekStart = new Date();
//       const monthStart = new Date();

//       switch (period) {
//         case '7d':
//           periodStart.setDate(periodStart.getDate() - 7);
//           weekStart.setDate(weekStart.getDate() - 7);
//           monthStart.setDate(monthStart.getDate() - 30);
//           break;
//         case '30d':
//           periodStart.setDate(periodStart.getDate() - 30);
//           weekStart.setDate(weekStart.getDate() - 7);
//           monthStart.setDate(monthStart.getDate() - 30);
//           break;
//         default:
//           periodStart.setDate(periodStart.getDate() - 30);
//           weekStart.setDate(weekStart.getDate() - 7);
//           monthStart.setDate(monthStart.getDate() - 30);
//       }

//       const [dailyActiveUsers, weeklyActiveUsers, monthlyActiveUsers, commentsPerDay, projectsPerUser, tasksPerUser] = await Promise.all([
//         User.countDocuments({ lastActive: { $gte: periodStart } }),
//         User.countDocuments({ lastActive: { $gte: weekStart } }),
//         User.countDocuments({ lastActive: { $gte: monthStart } }),
//         Comment.countDocuments({ createdAt: { $gte: periodStart } }) / 30,
//         Project.countDocuments() / Math.max(await User.countDocuments(), 1),
//         Task.countDocuments() / Math.max(await User.countDocuments(), 1)
//       ]);

//       return {
//         dailyActiveUsers,
//         weeklyActiveUsers,
//         monthlyActiveUsers,
//         commentsPerDay: Math.round(commentsPerDay * 100) / 100,
//         projectsPerUser: Math.round(projectsPerUser * 100) / 100,
//         tasksPerUser: Math.round(tasksPerUser * 100) / 100
//       };
//     } catch (error) {
//       throw new AppError('ENGAGEMENT_ANALYTICS_FETCH_FAILED', 'Failed to fetch engagement analytics', 500);
//     }
//   }

//   async getDeadlineAnalytics(): Promise<DeadlineAnalytics> {
//     try {
//       const now = new Date();
//       const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

//       const [totalDeadlines, upcomingDeadlines, overdueDeadlines, deadlinesThisWeek] = await Promise.all([
//         Task.countDocuments({ dueDate: { $exists: true } }),
//         Task.countDocuments({ dueDate: { $gte: now, $lte: weekFromNow }, status: { $ne: 'completed' } }),
//         Task.countDocuments({ dueDate: { $lt: now }, status: { $ne: 'completed' } }),
//         Task.find({ dueDate: { $gte: now, $lte: weekFromNow }, status: { $ne: 'completed' } })
//           .populate('project', 'title')
//           .select('title dueDate project')
//           .exec()
//       ]);

//       return {
//         totalDeadlines,
//         upcomingDeadlines,
//         overdueDeadlines,
//         deadlinesThisWeek: deadlinesThisWeek.map(task => ({
//           title: task.title,
//           dueDate: task.dueDate!,
//           project: (task as any).project?.title || 'Unknown Project'
//         }))
//       };
//     } catch (error) {
//       throw new AppError('DEADLINE_ANALYTICS_FETCH_FAILED', 'Failed to fetch deadline analytics', 500);
//     }
//   }

//   private async getMemberGrowthData(period: string): Promise<Array<{ date: string; count: number }>> {
//     try {
//       // This would typically involve more complex aggregation
//       // For now, returning a simple structure
//       const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
//       const data = [];

//       for (let i = days - 1; i >= 0; i--) {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         const count = await User.countDocuments({
//           createdAt: {
//             $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
//             $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
//           }
//         });

//         data.push({
//           date: date.toISOString().split('T')[0],
//           count
//         });
//       }

//       return data;
//     } catch (error) {
//       return [];
//     }
//   }

//   private async getAverageProjectDuration(): Promise<number> {
//     try {
//       const projects = await Project.find({
//         status: 'completed',
//         startDate: { $exists: true },
//         endDate: { $exists: true }
//       }).select('startDate endDate').exec();

//       if (projects.length === 0) return 0;

//       const totalDuration = projects.reduce((sum, project) => {
//         const duration = project.endDate!.getTime() - project.startDate!.getTime();
//         return sum + duration;
//       }, 0);

//       return totalDuration / projects.length / (1000 * 60 * 60 * 24); // Convert to days
//     } catch (error) {
//       return 0;
//     }
//   }

//   private async getAverageTaskDuration(): Promise<number> {
//     try {
//       const tasks = await Task.find({
//         status: 'completed',
//         createdAt: { $exists: true },
//         updatedAt: { $exists: true }
//       }).select('createdAt updatedAt').exec();

//       if (tasks.length === 0) return 0;

//       const totalDuration = tasks.reduce((sum, task) => {
//         const duration = task.updatedAt!.getTime() - task.createdAt!.getTime();
//         return sum + duration;
//       }, 0);

//       return totalDuration / tasks.length / (1000 * 60 * 60 * 24); // Convert to days
//     } catch (error) {
//       return 0;
//     }
//   }
// }

// export const analyticsService = new AnalyticsService();
