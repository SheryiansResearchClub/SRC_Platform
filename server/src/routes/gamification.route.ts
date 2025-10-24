// import express from 'express';
// import gamificationController from '@/controllers/gamification.controller';
// import validators from '@/middleware/validators';
// import { isAuthenticate } from '@/middleware/auth/isAuthenticate';
// import { authorize } from '@/middleware/auth/authorize';

// const router = express.Router();

// // All gamification routes require authentication
// router.use(isAuthenticate);

// // GET /gamification/points/:userId - Get user points
// router.get(
//   '/points/:userId',
//   gamificationController.getUserPoints
// );

// // POST /gamification/points - Award points (system/admin)
// router.post(
//   '/points',
//   authorize('admin'),
//   validators.createUserValidation, // Using existing validation for now
//   gamificationController.awardPoints
// );

// // GET /gamification/leaderboard - Get leaderboard
// router.get(
//   '/leaderboard',
//   gamificationController.getLeaderboard
// );

// // GET /gamification/badges - Get all available badges
// router.get(
//   '/badges',
//   gamificationController.getAllBadges
// );

// // GET /gamification/badges/:userId - Get user badges
// router.get(
//   '/badges/:userId',
//   gamificationController.getUserBadges
// );

// // POST /gamification/badges/:userId - Award badge to user
// router.post(
//   '/badges/:userId',
//   authorize('admin'),
//   validators.createUserValidation, // Using existing validation for now
//   gamificationController.awardBadge
// );

// // GET /gamification/achievements/:userId - Get user achievements
// router.get(
//   '/achievements/:userId',
//   gamificationController.getUserAchievements
// );

// export default router;
