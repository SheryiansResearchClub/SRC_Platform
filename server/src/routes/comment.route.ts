// import express from 'express';
// import commentController from '@/controllers/comment.controller';
// import validators from '@/middleware/validators';
// import { isAuthenticate } from '@/middleware/auth/isAuthenticate';
// import { authorize } from '@/middleware/auth/authorize';
// import { apiRateLimiters } from '@/middleware/rate-limit';

// const router = express.Router();

// // All comment routes require authentication
// router.use(isAuthenticate);

// // POST /comments - Create comment (on project/task)
// router.post(
//   '/',
//   validators.createUserValidation, // Using existing validation for now
//   apiRateLimiters.postComment,
//   commentController.createComment
// );

// // GET /comments - Get comments (filtered by project/task)
// router.get(
//   '/',
//   validators.getUsersValidation, // Using existing validation for now
//   commentController.getComments
// );

// // GET /comments/:id - Get single comment
// router.get(
//   '/:id',
//   commentController.getCommentById
// );

// // PUT /comments/:id - Update comment
// router.put(
//   '/:id',
//   validators.updateUserValidation, // Using existing validation for now
//   commentController.updateComment
// );

// // DELETE /comments/:id - Delete comment
// router.delete(
//   '/:id',
//   commentController.deleteComment
// );

// // PUT /comments/:id/approve - Approve comment (admin/moderator)
// router.put(
//   '/:id/approve',
//   authorize('admin'), // Fixed: authorize expects single string, not array
//   commentController.approveComment
// );

// // PUT /comments/:id/reject - Reject comment (admin/moderator)
// router.put(
//   '/:id/reject',
//   authorize('admin'), // Fixed: authorize expects single string, not array
//   commentController.rejectComment
// );

// export default router;
