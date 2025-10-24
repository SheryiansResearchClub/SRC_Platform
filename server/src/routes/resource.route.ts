// import express from 'express';
// import resourceController from '@/controllers/resource.controller';
// import validators from '@/middleware/validators';
// import { isAuthenticate } from '@/middleware/auth/isAuthenticate';
// import { authorize } from '@/middleware/auth/authorize';
// import { apiRateLimiters } from '@/middleware/rate-limit';

// const router = express.Router();

// // All resource routes require authentication
// router.use(isAuthenticate);

// // POST /resources - Upload new resource (tutorial, document, snippet)
// router.post(
//   '/',
//   validators.createUserValidation, // Using existing validation for now
//   apiRateLimiters.createTask, // Using existing rate limiter
//   resourceController.createResource
// );

// // GET /resources - Get all resources (with filters: type, category)
// router.get(
//   '/',
//   validators.getUsersValidation, // Using existing validation for now
//   resourceController.getResources
// );

// // GET /resources/:id - Get single resource
// router.get(
//   '/:id',
//   resourceController.getResourceById
// );

// // PUT /resources/:id - Update resource
// router.put(
//   '/:id',
//   validators.updateUserValidation, // Using existing validation for now
//   resourceController.updateResource
// );

// // DELETE /resources/:id - Delete resource
// router.delete(
//   '/:id',
//   resourceController.deleteResource
// );

// // GET /resources/:id/download - Download resource
// router.get(
//   '/:id/download',
//   resourceController.downloadResource
// );

// // POST /resources/:id/like - Like/favorite resource
// router.post(
//   '/:id/like',
//   resourceController.likeResource
// );

// // GET /resources/categories - Get resource categories
// router.get(
//   '/categories',
//   resourceController.getCategories
// );

// export default router;
