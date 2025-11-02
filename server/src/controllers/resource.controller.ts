import { Request, Response, NextFunction } from 'express';
import { Resource } from '@/models/resource.model';
import { s3Service } from '@/integrations/s3Bucket/storage';
import mongoose from 'mongoose';
import { InternalServerError } from '@/utils/errors';
import { catchAsync } from '@/utils/catchAsync';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get user ID from authenticated request
 */
const getUserId = (req: Request): string => {
  // @ts-ignore - User attached by isAuthenticate middleware
  return req.user?.id || req.user?._id?.toString();
};

/**
 * Check resource ownership
 */
const checkOwnership = (resource: any, userId: string, action: string = 'perform this action') => {
  if (resource.uploader.toString() !== userId) {
    throw new InternalServerError(`You are not authorized to ${action}`);
  }
};

/**
 * Validate MongoDB ObjectId
 */
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Build query filters
 */
const buildQueryFilters = (query: any) => {
  const filters: any = {
    status: 'approved',
    visibility: 'public',
    isDeleted: false
  };

  // Category filter
  if (query.category) {
    filters.category = query.category;
  }

  // Type filter (if you have different types)
  if (query.type) {
    filters.type = query.type;
  }

  // Featured filter
  if (query.featured === 'true') {
    filters.featured = true;
  }

  // Search filter
  if (query.search) {
    filters.$text = { $search: query.search };
  }

  // Tags filter
  if (query.tags) {
    const tagsArray = Array.isArray(query.tags) ? query.tags : [query.tags];
    filters.tags = { $in: tagsArray };
  }

  // Uploader filter
  if (query.uploader) {
    filters.uploader = query.uploader;
  }

  return filters;
};

/**
 * Build sort options
 */
const buildSortOptions = (sortBy?: string, order?: string) => {
  const sortOptions: any = {};

  const sortField = sortBy || 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;

  // Handle nested fields
  if (sortField === 'downloads') {
    sortOptions['stats.downloads'] = sortOrder;
  } else if (sortField === 'views') {
    sortOptions['stats.views'] = sortOrder;
  } else if (sortField === 'likes') {
    sortOptions['likes.count'] = sortOrder;
  } else {
    sortOptions[sortField] = sortOrder;
  }

  return sortOptions;
};

/**
 * Format pagination response
 */
const formatPaginationResponse = (page: number, limit: number, total: number) => {
  return {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  };
};

// ============================================
// CONTROLLER METHODS
// ============================================

/**
 * @desc    Create/Upload new resource
 * @route   POST /api/resources
 * @access  Private
 */
const createResource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore - file attached by multer middleware
  const file = req.file;
  const { title, description, category, tags, visibility = 'public', externalUrl, isExternal } = req.body;
  const userId = getUserId(req);

  // Validate: Either file or external URL must be provided
  if (!isExternal && !file) {
    throw new InternalServerError('No file uploaded. Please provide a file or external URL.');
  }

  if (isExternal && !externalUrl) {
    throw new InternalServerError('External URL is required when isExternal is true.');
  }

  let s3Data = {};
  let metadata = {};

  // Upload to S3 if not external resource
  if (!isExternal && file) {
    // Validate file size
    if (!s3Service.validateFileSize(file.size, 100 * 1024 * 1024)) {
      throw new InternalServerError('File size exceeds 100MB limit.');
    }

    try {
      // Upload file to S3 with image processing
      const uploadResult = await s3Service.uploadFile(
        file.buffer,
        file.originalname,
        userId,
        {
          category: category || 'general',
          mimeType: file.mimetype,
          processImage: file.mimetype.startsWith('image/'),
          isPublic: visibility === 'public'
        }
      );

      s3Data = {
        key: uploadResult.key,
        bucket: uploadResult.bucket,
        region: uploadResult.region,
        url: uploadResult.url,
        size: uploadResult.size,
        mimeType: uploadResult.mimeType,
        etag: uploadResult.etag,
        versionId: uploadResult.versionId
      };

      metadata = {
        originalName: file.originalname,
        extension: uploadResult.metadata?.extension,
        thumbnailKey: uploadResult.metadata?.thumbnailKey,
        width: uploadResult.metadata?.width,
        height: uploadResult.metadata?.height
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new InternalServerError('Failed to upload file to storage. Please try again.');
    }
  }

  // Create resource in database
  const resourceData: any = {
    title,
    description,
    uploader: userId,
    category: category || 'other',
    visibility,
    status: 'approved', // Or 'pending' if you want moderation
    isExternal: isExternal || false
  };

  if (!isExternal) {
    resourceData.s3 = s3Data;
    resourceData.metadata = metadata;
  } else {
    resourceData.externalUrl = externalUrl;
  }

  // Parse tags if provided
  if (tags) {
    try {
      resourceData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    } catch (error) {
      resourceData.tags = Array.isArray(tags) ? tags : [tags];
    }
  }

  const resource = await Resource.create(resourceData);
  await resource.populate('uploader', 'name email avatar');

  res.status(201).json({
    success: true,
    message: 'Resource created successfully',
    data: resource
  });
});

/**
 * @desc    Get all resources with filters and pagination
 * @route   GET /api/resources
 * @access  Private
 */
const getResources = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    order = 'desc',
    ...filterParams
  } = req.query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit))); // Max 100 items per page
  const skip = (pageNum - 1) * limitNum;

  // Build query filters
  const filters = buildQueryFilters(filterParams);

  // Build sort options
  const sortOptions = buildSortOptions(sortBy as string, order as string);

  // Execute queries in parallel
  const [resources, total] = await Promise.all([
    Resource.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('uploader', 'name email avatar')
      .lean()
      .exec(),
    Resource.countDocuments(filters).exec()
  ]);

  // Format pagination
  const pagination = formatPaginationResponse(pageNum, limitNum, total);

  res.status(200).json({
    success: true,
    message: 'Resources fetched successfully',
    data: resources,
    pagination
  });
});

/**
 * @desc    Get single resource by ID
 * @route   GET /api/resources/:id
 * @access  Private
 */
const getResourceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new InternalServerError('Invalid resource ID format');
  }

  const resource = await Resource.findOne({
    _id: id,
    isDeleted: false
  })
    .populate('uploader', 'name email avatar')
    .exec();

  if (!resource) {
    throw new InternalServerError('Resource not found');
  }

  // Check visibility permissions
  const userId = getUserId(req);
  if (resource.visibility === 'private' && resource.uploader._id.toString() !== userId) {
    throw new InternalServerError('You do not have permission to view this resource');
  }

  // Increment view count asynchronously (don't wait)
  resource.incrementViews().catch((err: any) => console.error('View increment error:', err));

  res.status(200).json({
    success: true,
    message: 'Resource fetched successfully',
    data: resource
  });
});

/**
 * @desc    Update resource
 * @route   PUT /api/resources/:id
 * @access  Private
 */
const updateResource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, description, category, tags, visibility, featured } = req.body;
  const userId = getUserId(req);

  if (!isValidObjectId(id)) {
    throw new InternalServerError('Invalid resource ID format');
  }

  const resource = await Resource.findOne({
    _id: id,
    isDeleted: false
  });

  if (!resource) {
    throw new InternalServerError('Resource not found');
  }

  // Check ownership
  checkOwnership(resource, userId, 'update this resource');

  // Update allowed fields
  if (title !== undefined) resource.title = title;
  if (description !== undefined) resource.description = description;
  if (category !== undefined) resource.category = category;
  if (visibility !== undefined) resource.visibility = visibility;
  if (featured !== undefined) resource.featured = featured;

  if (tags !== undefined) {
    try {
      resource.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    } catch (error) {
      resource.tags = Array.isArray(tags) ? tags : [tags];
    }
  }

  await resource.save();
  await resource.populate('uploader', 'name email avatar');

  res.status(200).json({
    success: true,
    message: 'Resource updated successfully',
    data: resource
  });
});

/**
 * @desc    Delete resource
 * @route   DELETE /api/resources/:id
 * @access  Private
 */
const deleteResource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = getUserId(req);

  if (!isValidObjectId(id)) {
    throw new InternalServerError('Invalid resource ID format');
  }

  const resource = await Resource.findOne({
    _id: id,
    isDeleted: false
  });

  if (!resource) {
    throw new InternalServerError('Resource not found');
  }

  // Check ownership
  checkOwnership(resource, userId, 'delete this resource');

  try {
    // Delete from S3 and soft delete in database
    await s3Service.deleteResourceWithFiles(id, userId);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    throw new InternalServerError('Failed to delete resource. Please try again.');
  }
});

/**
 * @desc    Download resource
 * @route   GET /api/resources/:id/download
 * @access  Private
 */
const downloadResource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = getUserId(req);

  if (!isValidObjectId(id)) {
    throw new InternalServerError('Invalid resource ID format');
  }

  const resource = await Resource.findOne({
    _id: id,
    isDeleted: false,
    status: 'approved'
  });

  if (!resource) {
    throw new InternalServerError('Resource not found');
  }

  // Check access permissions for private resources
  if (resource.visibility === 'private' && resource.uploader.toString() !== userId) {
    throw new InternalServerError('You do not have permission to download this resource');
  }

  // Handle external resources
  if (resource.isExternal) {
    return res.status(200).json({
      success: true,
      message: 'External resource URL',
      data: {
        downloadUrl: resource.externalUrl,
        isExternal: true,
        title: resource.title
      }
    });
  }

  // Increment download count asynchronously
  resource.incrementDownloads().catch((err: any) => console.error('Download increment error:', err));

  try {
    // Get download URL (signed for private, public for public)
    let downloadUrl: string;

    if (resource.visibility === 'private' && resource.s3?.key) {
      downloadUrl = await s3Service.getSignedUrl(resource.s3.key, 300); // 5 minutes expiry
    } else {
      downloadUrl = resource.fileUrl || resource.s3?.url || '';
    }

    if (!downloadUrl) {
      throw new InternalServerError('Download URL not available');
    }

    res.status(200).json({
      success: true,
      message: 'Download URL generated successfully',
      data: {
        downloadUrl,
        filename: resource.metadata?.originalName || resource.title,
        size: resource.s3?.size,
        mimeType: resource.s3?.mimeType,
        expiresIn: resource.visibility === 'private' ? 300 : null
      }
    });
  } catch (error) {
    console.error('Download URL generation error:', error);
    throw new InternalServerError('Failed to generate download URL');
  }
});

/**
 * @desc    Like/Unlike resource
 * @route   POST /api/resources/:id/like
 * @access  Private
 */
const likeResource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = getUserId(req);

  if (!isValidObjectId(id)) {
    throw new InternalServerError('Invalid resource ID format');
  }

  const resource = await Resource.findOne({
    _id: id,
    isDeleted: false,
    status: 'approved'
  });

  if (!resource) {
    throw new InternalServerError('Resource not found');
  }

  // Toggle like
  await resource.toggleLike(userId);

  const isLiked = resource.likes.users.some(
    (user: any) => user.toString() === userId
  );

  res.status(200).json({
    success: true,
    message: isLiked ? 'Resource liked successfully' : 'Resource unliked successfully',
    data: {
      likesCount: resource.likes.count,
      isLiked
    }
  });
});

/**
 * @desc    Get resource categories
 * @route   GET /api/resources/categories
 * @access  Private
 */
const getCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Get distinct categories with counts
  const categories = await Resource.aggregate([
    {
      $match: {
        status: 'approved',
        visibility: 'public',
        isDeleted: false
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        count: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    message: 'Categories fetched successfully',
    data: categories
  });
});

// ============================================
// ADDITIONAL HELPER METHODS (Optional)
// ============================================

/**
 * @desc    Search resources
 * @route   GET /api/resources/search
 * @access  Private
 */
const searchResources = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { q, limit = 20 } = req.query;

  if (!q || typeof q !== 'string') {
    throw new InternalServerError('Search query is required');
  }

  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const resources = await Resource.find({
    $text: { $search: q },
    status: 'approved',
    visibility: 'public',
    isDeleted: false
  })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limitNum)
    .populate('uploader', 'name email avatar')
    .lean()
    .exec();

  res.status(200).json({
    success: true,
    message: 'Search results fetched successfully',
    data: resources,
    count: resources.length
  });
});

/**
 * @desc    Get trending resources
 * @route   GET /api/resources/trending
 * @access  Private
 */
const getTrendingResources = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { days = 7, limit = 10 } = req.query;

  const daysNum = Math.max(1, Number(days));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  const resources = await Resource.getTrending(daysNum, limitNum);

  res.status(200).json({
    success: true,
    message: 'Trending resources fetched successfully',
    data: resources
  });
});

/**
 * @desc    Get user's own resources
 * @route   GET /api/resources/my-resources
 * @access  Private
 */
const getMyResources = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUserId(req);
  const { page = 1, limit = 20, status } = req.query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const filters: any = {
    uploader: userId,
    isDeleted: false
  };

  if (status) {
    filters.status = status;
  }

  const [resources, total] = await Promise.all([
    Resource.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean()
      .exec(),
    Resource.countDocuments(filters).exec()
  ]);

  const pagination = formatPaginationResponse(pageNum, limitNum, total);

  res.status(200).json({
    success: true,
    message: 'Your resources fetched successfully',
    data: resources,
    pagination
  });
});

/**
 * @desc    Get user storage statistics
 * @route   GET /api/resources/storage-stats
 * @access  Private
 */
const getStorageStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUserId(req);

  const [totalSize, resourceCount] = await Promise.all([
    s3Service.getUserStorageSize(userId),
    Resource.countDocuments({
      uploader: userId,
      isDeleted: false
    })
  ]);

  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
  const storageLimit = 5 * 1024 * 1024 * 1024; // 5GB
  const usagePercentage = ((totalSize / storageLimit) * 100).toFixed(2);

  res.status(200).json({
    success: true,
    message: 'Storage statistics fetched successfully',
    data: {
      totalFiles: resourceCount,
      totalSize: totalSize,
      totalSizeMB: `${totalSizeMB} MB`,
      totalSizeGB: `${totalSizeGB} GB`,
      storageLimit: '5 GB',
      usagePercentage: `${usagePercentage}%`,
      remainingSpace: `${(5 - Number(totalSizeGB)).toFixed(2)} GB`
    }
  });
});

// ============================================
// EXPORT CONTROLLER
// ============================================

export default {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  downloadResource,
  likeResource,
  getCategories,
  searchResources,
  getTrendingResources,
  getMyResources,
  getStorageStats
};