// import express from 'express';
// import messageController from '@/controllers/message.controller';
// import validators from '@/middleware/validators';
// import { isAuthenticate } from '@/middleware/auth/isAuthenticate';
// import { apiRateLimiters } from '@/middleware/rate-limit';

// const router = express.Router();

// // All message routes require authentication
// router.use(isAuthenticate);

// // POST /messages - Send message
// router.post(
//   '/',
//   validators.createUserValidation, // Using existing validation for now
//   apiRateLimiters.createTask, // Using existing rate limiter
//   messageController.sendMessage
// );

// // GET /messages - Get messages (filtered by project/user)
// router.get(
//   '/',
//   validators.getUsersValidation, // Using existing validation for now
//   messageController.getMessages
// );

// // GET /messages/:id - Get single message
// router.get(
//   '/:id',
//   messageController.getMessageById
// );

// // PUT /messages/:id - Edit message
// router.put(
//   '/:id',
//   validators.updateUserValidation, // Using existing validation for now
//   messageController.editMessage
// );

// // DELETE /messages/:id - Delete message
// router.delete(
//   '/:id',
//   messageController.deleteMessage
// );

// // GET /messages/conversations - Get user conversations
// router.get(
//   '/conversations',
//   messageController.getUserConversations
// );

// // PUT /messages/:id/read - Mark message as read
// router.put(
//   '/:id/read',
//   messageController.markAsRead
// );

// export default router;
