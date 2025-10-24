// import express from 'express';
// import dashboardController from '@/controllers/dashboard.controller';
// import validators from '@/middleware/validators';
// import { isAuthenticate } from '@/middleware/auth/isAuthenticate';

// const router = express.Router();

// // All dashboard routes require authentication
// router.use(isAuthenticate);

// // GET /dashboard - Get user dashboard overview
// router.get(
//   '/',
//   dashboardController.getDashboard
// );

// // GET /dashboard/projects - Get user's ongoing projects
// router.get(
//   '/projects',
//   dashboardController.getUserProjects
// );

// // GET /dashboard/tasks/due-today - Get tasks due today
// router.get(
//   '/tasks/due-today',
//   dashboardController.getTasksDueToday
// );

// // GET /dashboard/tasks/urgent - Get urgent/overdue tasks
// router.get(
//   '/tasks/urgent',
//   dashboardController.getUrgentTasks
// );

// // GET /dashboard/messages - Get unread messages count
// router.get(
//   '/messages',
//   dashboardController.getUnreadMessagesCount
// );

// // GET /dashboard/activity - Get recent activity feed
// router.get(
//   '/activity',
//   dashboardController.getRecentActivity
// );

// export default router;
