// import express from 'express';
// import fileController from '@/controllers/file.controller';
// import validators from '@/middleware/validators';
// import { isAuthenticate } from '@/middleware/auth/isAuthenticate';
// import { authorize } from '@/middleware/auth/authorize';
// import { apiRateLimiters } from '@/middleware/rate-limit';

// const router = express.Router();

// // All file routes require authentication
// router.use(isAuthenticate);

// // POST /files/upload - Upload file/attachment
// router.post(
//   '/upload',
//   validators.createUserValidation, // Using existing validation for now
//   apiRateLimiters.uploadFile,
//   fileController.uploadFile
// );

// // GET /files - Get all files (filtered by project/resource type)
// router.get(
//   '/',
//   validators.getUsersValidation, // Using existing validation for now
//   fileController.getFiles
// );

// // GET /files/:id - Get single file details
// router.get(
//   '/:id',
//   fileController.getFileById
// );

// // GET /files/:id/download - Download file
// router.get(
//   '/:id/download',
//   fileController.downloadFile
// );

// // DELETE /files/:id - Delete file
// router.delete(
//   '/:id',
//   fileController.deleteFile
// );

// // PUT /files/:id/approve - Approve file (admin only)
// router.put(
//   '/:id/approve',
//   authorize('admin'),
//   fileController.approveFile
// );

// // GET /files/:id/versions - Get file version history
// router.get(
//   '/:id/versions',
//   fileController.getFileVersions
// );

// // POST /files/:id/versions - Upload new file version
// router.post(
//   '/:id/versions',
//   validators.updateUserValidation, // Using existing validation for now
//   fileController.uploadFileVersion
// );

// export default router;
