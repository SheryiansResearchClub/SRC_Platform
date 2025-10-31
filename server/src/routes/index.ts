import express from 'express';
import authRouter from '@/routes/auth.route';
import userRouter from '@/routes/user.route';
import projectRouter from '@/routes/project.route';
import taskRouter from '@/routes/task.route';
import commentRouter from '@/routes/comment.route';
import tagRouter from '@/routes/tag.route';
import messageRouter from '@/routes/message.route';
import notificationRouter from '@/routes/notification.route';
import gamificationRouter from '@/routes/gamification.route';
// import fileRouter from '@/routes/file.route';
// import dashboardRouter from '@/routes/dashboard.route';
// import eventRouter from '@/routes/event.route';
// import searchRouter from '@/routes/search.route';
// import adminAnalyticsRouter from '@/routes/admin-analytics.route';
// import resourceRouter from '@/routes/resource.route';
import { isAuthenticate } from '@/middleware/auth/isAuthenticate';

const router = express.Router();

router.get("/", (_req, res) => {
  return res.json({ message: "Welcome to SRC Platform" })
})

router.use('/auth', authRouter);

router.use(isAuthenticate);

router.use('/users', userRouter);
router.use('/projects', projectRouter);
router.use('/tasks', taskRouter);
router.use('/comments', commentRouter);
router.use('/tags', tagRouter);
router.use('/messages', messageRouter);
router.use('/notifications', notificationRouter);
router.use('/gamification', gamificationRouter);
// router.use('/files', fileRouter);
// router.use('/dashboard', dashboardRouter);
// router.use('/events', eventRouter);
// router.use('/search', searchRouter);
// router.use('/admin/analytics', adminAnalyticsRouter);
// router.use('/resources', resourceRouter);

export default router;