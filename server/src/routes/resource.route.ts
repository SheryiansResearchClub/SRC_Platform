import express from 'express';
import multer from 'multer';
import resourceController from '@/controllers/resource.controller';
import resourceValidators from '@/middleware/validators';
import { apiRateLimiters } from '@/middleware/rate-limit';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',

      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',

      // Code/Text
      'application/json',
      'text/html',
      'text/css',
      'application/javascript',
      'text/javascript',

      // Archives
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',

      // Audio
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',

      // Video
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'video/webm'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}. Please upload a supported file format.`));
    }
  }
});

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Note: If you want some routes to be public, move them here
// Example:
// router.get('/public', resourceValidators.getResourcesValidation, resourceController.getResources);


// GET /resources/search - Search resources (must be before /:id)
router.get(
  '/search',
  resourceValidators.searchResourcesValidation,
  resourceController.searchResources
);

// GET /resources/trending - Get trending resources (must be before /:id)
router.get(
  '/trending',
  resourceValidators.getTrendingValidation,
  resourceController.getTrendingResources
);

// GET /resources/categories - Get resource categories (must be before /:id)
router.get(
  '/categories',
  resourceController.getCategories
);

// GET /resources/my-resources - Get user's own resources (must be before /:id)
router.get(
  '/my-resources',
  resourceValidators.getMyResourcesValidation,
  resourceController.getMyResources
);

// GET /resources/storage-stats - Get user's storage statistics (must be before /:id)
router.get(
  '/storage-stats',
  resourceController.getStorageStats
);

// POST /resources - Upload new resource (tutorial, document, snippet)
router.post(
  '/',
  upload.single('file'),
  apiRateLimiters.createTask,
  resourceValidators.createResourceValidation,
  resourceController.createResource
);

// POST /resources/batch - Upload multiple resources (optional)
router.post(
  '/batch',
  upload.array('files', 10),
  resourceValidators.createResourceValidation,
  resourceController.createResource
);

// GET /resources - Get all resources (with filters: type, category)
router.get(
  '/',
  resourceValidators.getResourcesValidation,
  resourceController.getResources
);

// GET /resources/:id - Get single resource
router.get(
  '/:id',
  resourceValidators.resourceIdValidation,
  resourceController.getResourceById
);

// GET /resources/:id/download - Download resource
router.get(
  '/:id/download',
  resourceValidators.resourceIdValidation,
  resourceController.downloadResource
);

// PUT /resources/:id - Update resource
router.put(
  '/:id',
  resourceValidators.updateResourceValidation,
  resourceController.updateResource
);

// DELETE /resources/:id - Delete resource
router.delete(
  '/:id',
  resourceValidators.resourceIdValidation,
  resourceController.deleteResource
);

// POST /resources/:id/like - Like/favorite resource
router.post(
  '/:id/like',
  resourceValidators.resourceIdValidation,
  resourceController.likeResource
);

// ============================================
// ADMIN ROUTES (Optional - if you have admin role)
// ============================================

// Uncomment if you want admin-only routes

// router.use(authorize('admin')); // Only admins can access routes below

// // GET /resources/admin/all - Get all resources including deleted/pending
// router.get(
//   '/admin/all',
//   resourceValidators.getResourcesValidation,
//   resourceController.getAllResourcesAdmin
// );

// // PUT /resources/admin/:id/approve - Approve resource
// router.put(
//   '/admin/:id/approve',
//   resourceValidators.resourceIdValidation,
//   resourceController.approveResource
// );

// // PUT /resources/admin/:id/reject - Reject resource
// router.put(
//   '/admin/:id/reject',
//   resourceValidators.resourceIdValidation,
//   resourceController.rejectResource
// );

// // PUT /resources/admin/:id/feature - Feature/unfeature resource
// router.put(
//   '/admin/:id/feature',
//   resourceValidators.resourceIdValidation,
//   resourceController.toggleFeature
// );

// // DELETE /resources/admin/:id/permanent - Permanently delete resource
// router.delete(
//   '/admin/:id/permanent',
//   resourceValidators.resourceIdValidation,
//   resourceController.permanentDeleteResource
// );


router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large. Maximum size is 100MB.',
        error: error.message
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files.',
        error: error.message
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Please use "file" or "files" as field name.',
        error: error.message
      });
    }
  }

  if (error.message && error.message.includes('File type not allowed')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
});

export default router;