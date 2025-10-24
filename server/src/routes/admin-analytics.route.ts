// import express from 'express';
// import adminAnalyticsController from '@/controllers/admin-analytics.controller';
// import validators from '@/middleware/validators';
// import { isAuthenticate } from '@/middleware/auth/isAuthenticate';
// import { authorize } from '@/middleware/auth/authorize';

// const router = express.Router();

// // All admin analytics routes require authentication and admin role
// router.use(isAuthenticate);
// router.use(authorize('admin'));

// // GET /admin/analytics/overview - Get overall platform statistics
// router.get(
//   '/overview',
//   adminAnalyticsController.getOverview
// );

// // GET /admin/analytics/members - Get member activity analytics
// router.get(
//   '/members',
//   adminAnalyticsController.getMemberAnalytics
// );

// // GET /admin/analytics/projects - Get project completion rates
// router.get(
//   '/projects',
//   adminAnalyticsController.getProjectAnalytics
// );

// // GET /admin/analytics/tasks - Get task completion analytics
// router.get(
//   '/tasks',
//   adminAnalyticsController.getTaskAnalytics
// );

// // GET /admin/analytics/engagement - Get user engagement metrics
// router.get(
//   '/engagement',
//   adminAnalyticsController.getEngagementAnalytics
// );

// // GET /admin/analytics/deadlines - Get deadline tracking data
// router.get(
//   '/deadlines',
//   adminAnalyticsController.getDeadlineAnalytics
// );

// export default router;
