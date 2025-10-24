// import { Analytics, AnalyticsDocument, AnalyticsType } from '@/models/analytics.model';

// class AnalyticsRepository {
//   async create(analyticsData: {
//     type: 'daily' | 'weekly' | 'monthly';
//     date: Date;
//     userMetrics?: {
//       totalUsers: number;
//       activeUsers: number;
//       newUsers: number;
//       loginCount: number;
//     };
//     projectMetrics?: {
//       totalProjects: number;
//       activeProjects: number;
//       completedProjects: number;
//       newProjects: number;
//       averageProgress: number;
//     };
//     taskMetrics?: {
//       totalTasks: number;
//       completedTasks: number;
//       overdueTasks: number;
//       newTasks: number;
//       averageCompletionTime?: number;
//       onTimeCompletionRate: number;
//     };
//     engagementMetrics?: {
//       comments: number;
//       fileUploads: number;
//       messages: number;
//       resourceDownloads: number;
//     };
//     topPerformers?: Array<{
//       user: string;
//       metric: string;
//       value: number;
//     }>;
//   }): Promise<AnalyticsDocument> {
//     const analytics = await Analytics.create(analyticsData);
//     return analytics as AnalyticsDocument;
//   }

//   async findById(analyticsId: string): Promise<AnalyticsDocument | null> {
//     return await Analytics.findById(analyticsId)
//       .populate('topPerformers.user', 'name email avatarUrl')
//       .exec() as AnalyticsDocument | null;
//   }

//   async findByTypeAndDate(type: 'daily' | 'weekly' | 'monthly', date: Date): Promise<AnalyticsDocument | null> {
//     return await Analytics.findOne({ type, date })
//       .populate('topPerformers.user', 'name email avatarUrl')
//       .exec() as AnalyticsDocument | null;
//   }

//   async findByType(type: 'daily' | 'weekly' | 'monthly', options: {
//     startDate?: Date;
//     endDate?: Date;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<AnalyticsDocument[]> {
//     const {
//       startDate,
//       endDate,
//       page = 1,
//       limit = 50,
//       sort = '-date'
//     } = options;

//     const query: any = { type };

//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) query.date.$gte = startDate;
//       if (endDate) query.date.$lte = endDate;
//     }

//     return await Analytics.find(query)
//       .populate('topPerformers.user', 'name email avatarUrl')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as AnalyticsDocument[];
//   }

//   async findByDateRange(startDate: Date, endDate: Date, options: {
//     type?: 'daily' | 'weekly' | 'monthly';
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<AnalyticsDocument[]> {
//     const { type, page = 1, limit = 100, sort = '-date' } = options;

//     const query: any = {
//       date: { $gte: startDate, $lte: endDate }
//     };

//     if (type) query.type = type;

//     return await Analytics.find(query)
//       .populate('topPerformers.user', 'name email avatarUrl')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as AnalyticsDocument[];
//   }

//   async getLatest(type: 'daily' | 'weekly' | 'monthly'): Promise<AnalyticsDocument | null> {
//     return await Analytics.findOne({ type })
//       .populate('topPerformers.user', 'name email avatarUrl')
//       .sort({ date: -1 })
//       .exec() as AnalyticsDocument | null;
//   }

//   async getAnalyticsSummary(options: {
//     type?: 'daily' | 'weekly' | 'monthly';
//     days?: number;
//   } = {}): Promise<{
//     totalRecords: number;
//     averageUsers: number;
//     averageProjects: number;
//     averageTasks: number;
//     averageEngagement: number;
//     trends: {
//       userGrowth: number;
//       projectGrowth: number;
//       taskCompletion: number;
//       engagementGrowth: number;
//     };
//   }> {
//     const { type = 'daily', days = 30 } = options;
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);

//     const records = await this.findByDateRange(startDate, endDate, { type, limit: 1000 });

//     if (records.length === 0) {
//       return {
//         totalRecords: 0,
//         averageUsers: 0,
//         averageProjects: 0,
//         averageTasks: 0,
//         averageEngagement: 0,
//         trends: {
//           userGrowth: 0,
//           projectGrowth: 0,
//           taskCompletion: 0,
//           engagementGrowth: 0
//         }
//       };
//     }

//     const totalUsers = records.reduce((sum, record) => sum + (record.userMetrics?.totalUsers || 0), 0);
//     const totalProjects = records.reduce((sum, record) => sum + (record.projectMetrics?.totalProjects || 0), 0);
//     const totalTasks = records.reduce((sum, record) => sum + (record.taskMetrics?.totalTasks || 0), 0);
//     const totalEngagement = records.reduce((sum, record) => sum + (record.engagementMetrics?.comments || 0), 0);

//     const firstRecord = records[records.length - 1];
//     const lastRecord = records[0];

//     const userGrowth = this.calculateGrowth(
//       firstRecord?.userMetrics?.totalUsers || 0,
//       lastRecord?.userMetrics?.totalUsers || 0
//     );

//     const projectGrowth = this.calculateGrowth(
//       firstRecord?.projectMetrics?.totalProjects || 0,
//       lastRecord?.projectMetrics?.totalProjects || 0
//     );

//     const taskCompletion = this.calculateAverage(
//       records.map(r => r.taskMetrics?.onTimeCompletionRate || 0)
//     );

//     const engagementGrowth = this.calculateGrowth(
//       firstRecord?.engagementMetrics?.comments || 0,
//       lastRecord?.engagementMetrics?.comments || 0
//     );

//     return {
//       totalRecords: records.length,
//       averageUsers: Math.round(totalUsers / records.length),
//       averageProjects: Math.round(totalProjects / records.length),
//       averageTasks: Math.round(totalTasks / records.length),
//       averageEngagement: Math.round(totalEngagement / records.length),
//       trends: {
//         userGrowth,
//         projectGrowth,
//         taskCompletion,
//         engagementGrowth
//       }
//     };
//   }

//   private calculateGrowth(start: number, end: number): number {
//     if (start === 0) return end > 0 ? 100 : 0;
//     return Math.round(((end - start) / start) * 100);
//   }

//   private calculateAverage(values: number[]): number {
//     if (values.length === 0) return 0;
//     return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
//   }

//   async getUserMetricsTrend(options: {
//     type?: 'daily' | 'weekly' | 'monthly';
//     days?: number;
//   } = {}): Promise<Array<{
//     date: Date;
//     totalUsers: number;
//     activeUsers: number;
//     newUsers: number;
//     loginCount: number;
//   }>> {
//     const { type = 'daily', days = 30 } = options;
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);

//     const records = await this.findByDateRange(startDate, endDate, { type });

//     return records.map(record => ({
//       date: record.date,
//       totalUsers: record.userMetrics?.totalUsers || 0,
//       activeUsers: record.userMetrics?.activeUsers || 0,
//       newUsers: record.userMetrics?.newUsers || 0,
//       loginCount: record.userMetrics?.loginCount || 0
//     }));
//   }

//   async getProjectMetricsTrend(options: {
//     type?: 'daily' | 'weekly' | 'monthly';
//     days?: number;
//   } = {}): Promise<Array<{
//     date: Date;
//     totalProjects: number;
//     activeProjects: number;
//     completedProjects: number;
//     newProjects: number;
//     averageProgress: number;
//   }>> {
//     const { type = 'daily', days = 30 } = options;
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);

//     const records = await this.findByDateRange(startDate, endDate, { type });

//     return records.map(record => ({
//       date: record.date,
//       totalProjects: record.projectMetrics?.totalProjects || 0,
//       activeProjects: record.projectMetrics?.activeProjects || 0,
//       completedProjects: record.projectMetrics?.completedProjects || 0,
//       newProjects: record.projectMetrics?.newProjects || 0,
//       averageProgress: record.projectMetrics?.averageProgress || 0
//     }));
//   }

//   async getTaskMetricsTrend(options: {
//     type?: 'daily' | 'weekly' | 'monthly';
//     days?: number;
//   } = {}): Promise<Array<{
//     date: Date;
//     totalTasks: number;
//     completedTasks: number;
//     overdueTasks: number;
//     newTasks: number;
//     onTimeCompletionRate: number;
//   }>> {
//     const { type = 'daily', days = 30 } = options;
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);

//     const records = await this.findByDateRange(startDate, endDate, { type });

//     return records.map(record => ({
//       date: record.date,
//       totalTasks: record.taskMetrics?.totalTasks || 0,
//       completedTasks: record.taskMetrics?.completedTasks || 0,
//       overdueTasks: record.taskMetrics?.overdueTasks || 0,
//       newTasks: record.taskMetrics?.newTasks || 0,
//       onTimeCompletionRate: record.taskMetrics?.onTimeCompletionRate || 0
//     }));
//   }

//   async getEngagementMetricsTrend(options: {
//     type?: 'daily' | 'weekly' | 'monthly';
//     days?: number;
//   } = {}): Promise<Array<{
//     date: Date;
//     comments: number;
//     fileUploads: number;
//     messages: number;
//     resourceDownloads: number;
//   }>> {
//     const { type = 'daily', days = 30 } = options;
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);

//     const records = await this.findByDateRange(startDate, endDate, { type });

//     return records.map(record => ({
//       date: record.date,
//       comments: record.engagementMetrics?.comments || 0,
//       fileUploads: record.engagementMetrics?.fileUploads || 0,
//       messages: record.engagementMetrics?.messages || 0,
//       resourceDownloads: record.engagementMetrics?.resourceDownloads || 0
//     }));
//   }

//   async getTopPerformers(options: {
//     type?: 'daily' | 'weekly' | 'monthly';
//     metric?: string;
//     limit?: number;
//     days?: number;
//   } = {}): Promise<Array<{
//     user: string;
//     metric: string;
//     value: number;
//     date: Date;
//   }>> {
//     const { type = 'daily', metric, limit = 10, days = 7 } = options;
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);

//     const records = await this.findByDateRange(startDate, endDate, { type });

//     const allPerformers: Array<{
//       user: string;
//       metric: string;
//       value: number;
//       date: Date;
//     }> = [];

//     records.forEach(record => {
//       if (record.topPerformers) {
//         record.topPerformers.forEach(performer => {
//           if (!metric || performer.metric === metric) {
//             allPerformers.push({
//               user: performer.user.toString(),
//               metric: performer.metric,
//               value: performer.value,
//               date: record.date
//             });
//           }
//         });
//       }
//     });

//     // Sort by value and take top performers
//     return allPerformers
//       .sort((a, b) => b.value - a.value)
//       .slice(0, limit);
//   }

//   async update(analyticsId: string, updateData: Partial<AnalyticsType>): Promise<AnalyticsDocument | null> {
//     return await Analytics.findByIdAndUpdate(analyticsId, updateData, { new: true })
//       .populate('topPerformers.user', 'name email avatarUrl')
//       .exec() as AnalyticsDocument | null;
//   }

//   async delete(analyticsId: string): Promise<void> {
//     await Analytics.findByIdAndDelete(analyticsId);
//   }

//   async deleteByDateRange(startDate: Date, endDate: Date, type?: 'daily' | 'weekly' | 'monthly'): Promise<number> {
//     const query: any = {
//       date: { $gte: startDate, $lte: endDate }
//     };

//     if (type) query.type = type;

//     const result = await Analytics.deleteMany(query);
//     return result.deletedCount || 0;
//   }

//   async getMetricsComparison(options: {
//     type?: 'daily' | 'weekly' | 'monthly';
//     currentPeriodDays: number;
//     previousPeriodDays: number;
//   } = {
//     currentPeriodDays: 7,
//     previousPeriodDays: 7
//   }): Promise<{
//     current: {
//       users: number;
//       projects: number;
//       tasks: number;
//       engagement: number;
//     };
//     previous: {
//       users: number;
//       projects: number;
//       tasks: number;
//       engagement: number;
//     };
//     growth: {
//       users: number;
//       projects: number;
//       tasks: number;
//       engagement: number;
//     };
//   }> {
//     const { type = 'daily', currentPeriodDays, previousPeriodDays } = options;

//     const now = new Date();
//     const currentStart = new Date(now.getTime() - currentPeriodDays * 24 * 60 * 60 * 1000);
//     const previousStart = new Date(now.getTime() - (currentPeriodDays + previousPeriodDays) * 24 * 60 * 60 * 1000);
//     const previousEnd = new Date(now.getTime() - currentPeriodDays * 24 * 60 * 60 * 1000);

//     const [currentRecords, previousRecords] = await Promise.all([
//       this.findByDateRange(currentStart, now, { type }),
//       this.findByDateRange(previousStart, previousEnd, { type })
//     ]);

//     const calculatePeriodMetrics = (records: AnalyticsDocument[]) => ({
//       users: records.reduce((sum, r) => sum + (r.userMetrics?.totalUsers || 0), 0),
//       projects: records.reduce((sum, r) => sum + (r.projectMetrics?.totalProjects || 0), 0),
//       tasks: records.reduce((sum, r) => sum + (r.taskMetrics?.totalTasks || 0), 0),
//       engagement: records.reduce((sum, r) => sum + (r.engagementMetrics?.comments || 0), 0)
//     });

//     const current = calculatePeriodMetrics(currentRecords);
//     const previous = calculatePeriodMetrics(previousRecords);

//     const calculateGrowth = (current: number, previous: number) => {
//       if (previous === 0) return current > 0 ? 100 : 0;
//       return Math.round(((current - previous) / previous) * 100);
//     };

//     return {
//       current,
//       previous,
//       growth: {
//         users: calculateGrowth(current.users, previous.users),
//         projects: calculateGrowth(current.projects, previous.projects),
//         tasks: calculateGrowth(current.tasks, previous.tasks),
//         engagement: calculateGrowth(current.engagement, previous.engagement)
//       }
//     };
//   }

//   async getPlatformOverview(options: {
//     type?: 'daily' | 'weekly' | 'monthly';
//     days?: number;
//   } = {}): Promise<{
//     userMetrics: {
//       totalUsers: number;
//       activeUsers: number;
//       newUsers: number;
//       loginCount: number;
//       growth: number;
//     };
//     projectMetrics: {
//       totalProjects: number;
//       activeProjects: number;
//       completedProjects: number;
//       averageProgress: number;
//       growth: number;
//     };
//     taskMetrics: {
//       totalTasks: number;
//       completedTasks: number;
//       overdueTasks: number;
//       onTimeCompletionRate: number;
//       growth: number;
//     };
//     engagementMetrics: {
//       comments: number;
//       fileUploads: number;
//       messages: number;
//       resourceDownloads: number;
//       growth: number;
//     };
//   }> {
//     const { type = 'daily', days = 30 } = options;
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);

//     const records = await this.findByDateRange(startDate, endDate, { type });

//     if (records.length === 0) {
//       return {
//         userMetrics: { totalUsers: 0, activeUsers: 0, newUsers: 0, loginCount: 0, growth: 0 },
//         projectMetrics: { totalProjects: 0, activeProjects: 0, completedProjects: 0, averageProgress: 0, growth: 0 },
//         taskMetrics: { totalTasks: 0, completedTasks: 0, overdueTasks: 0, onTimeCompletionRate: 0, growth: 0 },
//         engagementMetrics: { comments: 0, fileUploads: 0, messages: 0, resourceDownloads: 0, growth: 0 }
//       };
//     }

//     const latestRecord = records[0];
//     const oldestRecord = records[records.length - 1];

//     const userGrowth = this.calculateGrowth(
//       oldestRecord?.userMetrics?.totalUsers || 0,
//       latestRecord?.userMetrics?.totalUsers || 0
//     );

//     const projectGrowth = this.calculateGrowth(
//       oldestRecord?.projectMetrics?.totalProjects || 0,
//       latestRecord?.projectMetrics?.totalProjects || 0
//     );

//     const taskGrowth = this.calculateGrowth(
//       oldestRecord?.taskMetrics?.totalTasks || 0,
//       latestRecord?.taskMetrics?.totalTasks || 0
//     );

//     const engagementGrowth = this.calculateGrowth(
//       oldestRecord?.engagementMetrics?.comments || 0,
//       latestRecord?.engagementMetrics?.comments || 0
//     );

//     return {
//       userMetrics: {
//         totalUsers: latestRecord?.userMetrics?.totalUsers || 0,
//         activeUsers: latestRecord?.userMetrics?.activeUsers || 0,
//         newUsers: latestRecord?.userMetrics?.newUsers || 0,
//         loginCount: latestRecord?.userMetrics?.loginCount || 0,
//         growth: userGrowth
//       },
//       projectMetrics: {
//         totalProjects: latestRecord?.projectMetrics?.totalProjects || 0,
//         activeProjects: latestRecord?.projectMetrics?.activeProjects || 0,
//         completedProjects: latestRecord?.projectMetrics?.completedProjects || 0,
//         averageProgress: latestRecord?.projectMetrics?.averageProgress || 0,
//         growth: projectGrowth
//       },
//       taskMetrics: {
//         totalTasks: latestRecord?.taskMetrics?.totalTasks || 0,
//         completedTasks: latestRecord?.taskMetrics?.completedTasks || 0,
//         overdueTasks: latestRecord?.taskMetrics?.overdueTasks || 0,
//         onTimeCompletionRate: latestRecord?.taskMetrics?.onTimeCompletionRate || 0,
//         growth: taskGrowth
//       },
//       engagementMetrics: {
//         comments: latestRecord?.engagementMetrics?.comments || 0,
//         fileUploads: latestRecord?.engagementMetrics?.fileUploads || 0,
//         messages: latestRecord?.engagementMetrics?.messages || 0,
//         resourceDownloads: latestRecord?.engagementMetrics?.resourceDownloads || 0,
//         growth: engagementGrowth
//       }
//     };
//   }

//   async countByType(type: 'daily' | 'weekly' | 'monthly'): Promise<number> {
//     return await Analytics.countDocuments({ type });
//   }

//   async getOldestRecord(type: 'daily' | 'weekly' | 'monthly'): Promise<AnalyticsDocument | null> {
//     return await Analytics.findOne({ type })
//       .populate('topPerformers.user', 'name email avatarUrl')
//       .sort({ date: 1 })
//       .exec() as AnalyticsDocument | null;
//   }

//   async getNewestRecord(type: 'daily' | 'weekly' | 'monthly'): Promise<AnalyticsDocument | null> {
//     return await Analytics.findOne({ type })
//       .populate('topPerformers.user', 'name email avatarUrl')
//       .sort({ date: -1 })
//       .exec() as AnalyticsDocument | null;
//   }
// }

// export const analyticsRepo = new AnalyticsRepository();
