// import { User, GamificationPoint, GamificationBadge, GamificationAchievement } from '@/models';
// import { activityLogRepo } from '@/repositories/activity-log.repository';
// import { AppError } from '@/utils/errors';

// interface LeaderboardEntry {
//   user: {
//     _id: string;
//     name: string;
//     email: string;
//     avatarUrl?: string;
//   };
//   points: number;
//   badges: number;
//   rank: number;
// }

// interface Badge {
//   _id: string;
//   name: string;
//   description: string;
//   icon: string;
//   category: string;
//   points: number;
//   criteria: any;
// }

// class GamificationService {
//   async getUserPoints(userId: string): Promise<{ totalPoints: number; pointsByCategory: any }> {
//     try {
//       const points = await GamificationPoint.aggregate([
//         { $match: { user: userId } },
//         {
//           $group: {
//             _id: '$category',
//             total: { $sum: '$points' },
//             count: { $sum: 1 }
//           }
//         }
//       ]);

//       const totalPoints = points.reduce((sum, category) => sum + category.total, 0);

//       return {
//         totalPoints,
//         pointsByCategory: points
//       };
//     } catch (error) {
//       throw new AppError('USER_POINTS_FETCH_FAILED', 'Failed to fetch user points', 500);
//     }
//   }

//   async awardPoints(userId: string, points: number, reason: string): Promise<{ success: boolean; totalPoints: number }> {
//     try {
//       // Create points record
//       await GamificationPoint.create({
//         user: userId,
//         points,
//         category: 'achievement',
//         reason,
//         awardedBy: 'system'
//       });

//       // Update user's total points (if User model has points field)
//       await User.findByIdAndUpdate(userId, {
//         $inc: { totalPoints: points },
//         $set: { lastActive: new Date() }
//       });

//       const userPoints = await this.getUserPoints(userId);

//       // Check for badge achievements
//       await this.checkBadgeAchievements(userId);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'points_awarded',
//         entityType: 'Gamification',
//         entityId: userId,
//         user: userId,
//         metadata: { points, reason, totalPoints: userPoints.totalPoints }
//       });

//       return {
//         success: true,
//         totalPoints: userPoints.totalPoints
//       };
//     } catch (error) {
//       throw new AppError('POINTS_AWARD_FAILED', 'Failed to award points', 500);
//     }
//   }

//   async getLeaderboard(period: string, limit: number): Promise<LeaderboardEntry[]> {
//     try {
//       let dateFilter = {};
//       const now = new Date();

//       switch (period) {
//         case 'week':
//           dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
//           break;
//         case 'month':
//           dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
//           break;
//         case 'all':
//         default:
//           dateFilter = {};
//       }

//       const leaderboard = await GamificationPoint.aggregate([
//         { $match: dateFilter },
//         {
//           $group: {
//             _id: '$user',
//             totalPoints: { $sum: '$points' }
//           }
//         },
//         {
//           $lookup: {
//             from: 'users',
//             localField: '_id',
//             foreignField: '_id',
//             as: 'user'
//           }
//         },
//         { $unwind: '$user' },
//         {
//           $lookup: {
//             from: 'gamificationbadges',
//             localField: '_id',
//             foreignField: 'user',
//             as: 'badges'
//           }
//         },
//         {
//           $project: {
//             user: {
//               _id: '$user._id',
//               name: '$user.name',
//               email: '$user.email',
//               avatarUrl: '$user.avatarUrl'
//             },
//             points: '$totalPoints',
//             badges: { $size: '$badges' }
//           }
//         },
//         { $sort: { points: -1 } },
//         { $limit: limit }
//       ]);

//       // Add rank
//       return leaderboard.map((entry, index) => ({
//         ...entry,
//         rank: index + 1
//       }));
//     } catch (error) {
//       throw new AppError('LEADERBOARD_FETCH_FAILED', 'Failed to fetch leaderboard', 500);
//     }
//   }

//   async getAllBadges(): Promise<Badge[]> {
//     try {
//       const badges = await GamificationBadge.find({})
//         .sort({ points: 1 })
//         .exec();

//       return badges.map(badge => ({
//         _id: badge._id,
//         name: badge.name,
//         description: badge.description,
//         icon: badge.icon,
//         category: badge.category,
//         points: badge.points,
//         criteria: badge.criteria
//       }));
//     } catch (error) {
//       throw new AppError('BADGES_FETCH_FAILED', 'Failed to fetch badges', 500);
//     }
//   }

//   async getUserBadges(userId: string): Promise<Badge[]> {
//     try {
//       const badges = await GamificationBadge.find({ user: userId })
//         .populate('badgeId')
//         .sort({ awardedAt: -1 })
//         .exec();

//       return badges.map(badge => ({
//         _id: (badge as any).badgeId._id,
//         name: (badge as any).badgeId.name,
//         description: (badge as any).badgeId.description,
//         icon: (badge as any).badgeId.icon,
//         category: (badge as any).badgeId.category,
//         points: (badge as any).badgeId.points,
//         criteria: (badge as any).badgeId.criteria
//       }));
//     } catch (error) {
//       throw new AppError('USER_BADGES_FETCH_FAILED', 'Failed to fetch user badges', 500);
//     }
//   }

//   async awardBadge(userId: string, badgeId: string, reason: string): Promise<Badge> {
//     try {
//       // Check if user already has this badge
//       const existingBadge = await GamificationBadge.findOne({ user: userId, badgeId });
//       if (existingBadge) {
//         throw new AppError('BADGE_ALREADY_AWARDED', 'User already has this badge', 400);
//       }

//       // Get badge details
//       const badge = await GamificationBadge.findById(badgeId);
//       if (!badge) {
//         throw new AppError('BADGE_NOT_FOUND', 'Badge not found', 404);
//       }

//       // Award the badge
//       await GamificationBadge.create({
//         user: userId,
//         badgeId,
//         reason,
//         awardedBy: 'admin'
//       });

//       // Award points for the badge
//       await this.awardPoints(userId, badge.points, `Badge: ${badge.name}`);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'badge_awarded',
//         entityType: 'Gamification',
//         entityId: userId,
//         user: userId,
//         metadata: { badgeName: badge.name, points: badge.points }
//       });

//       return {
//         _id: badge._id,
//         name: badge.name,
//         description: badge.description,
//         icon: badge.icon,
//         category: badge.category,
//         points: badge.points,
//         criteria: badge.criteria
//       };
//     } catch (error) {
//       throw new AppError('BADGE_AWARD_FAILED', 'Failed to award badge', 500);
//     }
//   }

//   async getUserAchievements(userId: string): Promise<any[]> {
//     try {
//       // This would aggregate various achievements
//       // For now, returning user badges as achievements
//       const badges = await this.getUserBadges(userId);

//       return badges.map(badge => ({
//         type: 'badge',
//         title: badge.name,
//         description: badge.description,
//         points: badge.points,
//         category: badge.category,
//         icon: badge.icon,
//         earnedAt: new Date() // This would need to be stored in the badge record
//       }));
//     } catch (error) {
//       throw new AppError('USER_ACHIEVEMENTS_FETCH_FAILED', 'Failed to fetch user achievements', 500);
//     }
//   }

//   private async checkBadgeAchievements(userId: string): Promise<void> {
//     try {
//       // Get user stats
//       const userPoints = await this.getUserPoints(userId);
//       const userBadges = await this.getUserBadges(userId);

//       // Define badge criteria (this would typically be in a database)
//       const badgeCriteria = [
//         {
//           id: 'first_project',
//           name: 'First Project',
//           description: 'Created your first project',
//           icon: '🎯',
//           category: 'milestone',
//           points: 100,
//           criteria: { projectsCount: 1 }
//         },
//         {
//           id: 'project_master',
//           name: 'Project Master',
//           description: 'Created 10 projects',
//           icon: '🏆',
//           category: 'achievement',
//           points: 500,
//           criteria: { projectsCount: 10 }
//         },
//         {
//           id: 'points_collector',
//           name: 'Points Collector',
//           description: 'Earned 1000 points',
//           icon: '⭐',
//           category: 'points',
//           points: 200,
//           criteria: { totalPoints: 1000 }
//         }
//       ];

//       // Check each badge
//       for (const criteria of badgeCriteria) {
//         const hasBadge = userBadges.some(badge => badge.name === criteria.name);

//         if (!hasBadge) {
//           // Check if user meets criteria
//           let meetsCriteria = false;

//           switch (criteria.criteria) {
//             case 'projectsCount':
//               // This would need to check actual project count
//               meetsCriteria = userPoints.totalPoints > 0; // Simplified
//               break;
//             case 'totalPoints':
//               meetsCriteria = userPoints.totalPoints >= criteria.criteria.totalPoints;
//               break;
//           }

//           if (meetsCriteria) {
//             await this.awardBadge(userId, criteria.id, `Achievement: ${criteria.name}`);
//           }
//         }
//       }
//     } catch (error) {
//       // Don't throw error for badge checking
//       console.error('Badge check failed:', error);
//     }
//   }
// }

// export const gamificationService = new GamificationService();
