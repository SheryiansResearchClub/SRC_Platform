// import express from 'express';
// import tagController from '@/controllers/tag.controller';
// import validators from '@/middleware/validators';
// import { isAuthenticate } from '@/middleware/auth/isAuthenticate';
// import { authorize } from '@/middleware/auth/authorize';

// const router = express.Router();

// // All tag routes require authentication
// router.use(isAuthenticate);

// // POST /tags - Create new tag
// router.post(
//   '/',
//   authorize('admin'),
//   validators.createUserValidation, // Using existing validation for now
//   tagController.createTag
// );

// // GET /tags - Get all tags
// router.get(
//   '/',
//   validators.getUsersValidation, // Using existing validation for now
//   tagController.getTags
// );

// // GET /tags/:id - Get single tag
// router.get(
//   '/:id',
//   tagController.getTagById
// );

// // PUT /tags/:id - Update tag
// router.put(
//   '/:id',
//   authorize('admin'),
//   validators.updateUserValidation, // Using existing validation for now
//   tagController.updateTag
// );

// // DELETE /tags/:id - Delete tag
// router.delete(
//   '/:id',
//   authorize('admin'),
//   tagController.deleteTag
// );

// // GET /tags/projects - Get project type tags (Web, Electronics, AI, etc.)
// router.get(
//   '/projects',
//   tagController.getProjectTypeTags
// );

// export default router;
