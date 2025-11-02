import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg
      }))
    });
  }

  next();
};

const isValidObjectId = (value: string) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid ID format');
  }
  return true;
};

const isValidTagsArray = (value: any) => {
  if (!value) return true;

  let tags;
  try {
    tags = typeof value === 'string' ? JSON.parse(value) : value;
  } catch (error) {
    throw new Error('Tags must be a valid JSON array');
  }

  if (!Array.isArray(tags)) {
    throw new Error('Tags must be an array');
  }

  if (tags.length > 20) {
    throw new Error('Maximum 20 tags allowed');
  }

  for (const tag of tags) {
    if (typeof tag !== 'string' || tag.length > 50) {
      throw new Error('Each tag must be a string with max 50 characters');
    }
  }

  return true;
};

const isValidCategory = (value: string) => {
  const validCategories = [
    'tutorial',
    'document',
    'snippet',
    'reference',
    'tool',
    'image',
    'video',
    'audio',
    'other'
  ];

  if (!validCategories.includes(value)) {
    throw new Error(`Category must be one of: ${validCategories.join(', ')}`);
  }

  return true;
};

const isValidVisibility = (value: string) => {
  const validVisibilities = ['public', 'private', 'unlisted'];

  if (!validVisibilities.includes(value)) {
    throw new Error(`Visibility must be one of: ${validVisibilities.join(', ')}`);
  }

  return true;
};

const isValidSortField = (value: string) => {
  const validSortFields = [
    'createdAt',
    'updatedAt',
    'title',
    'downloads',
    'views',
    'likes',
    'category'
  ];

  if (!validSortFields.includes(value)) {
    throw new Error(`Sort field must be one of: ${validSortFields.join(', ')}`);
  }

  return true;
};

/**
 * Validate URL format
 */
const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch (error) {
    throw new Error('Invalid URL format');
  }
};

export const createResourceValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .escape(),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters')
    .escape(),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .custom(isValidCategory),

  body('tags')
    .optional()
    .custom(isValidTagsArray),

  body('visibility')
    .optional()
    .trim()
    .custom(isValidVisibility),

  body('isExternal')
    .optional()
    .isBoolean()
    .withMessage('isExternal must be a boolean'),

  body('externalUrl')
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (req.body.isExternal === 'true' || req.body.isExternal === true) {
        if (!value) {
          throw new Error('External URL is required when isExternal is true');
        }
        isValidUrl(value);
      }
      return true;
    }),

  handleValidationErrors
];

export const updateResourceValidation = [
  param('id')
    .custom(isValidObjectId),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters')
    .escape(),

  body('category')
    .optional()
    .trim()
    .custom(isValidCategory),

  body('tags')
    .optional()
    .custom(isValidTagsArray),

  body('visibility')
    .optional()
    .trim()
    .custom(isValidVisibility),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),

  handleValidationErrors
];

export const getResourcesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sortBy')
    .optional()
    .trim()
    .custom(isValidSortField),

  query('order')
    .optional()
    .trim()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either asc or desc'),

  query('category')
    .optional()
    .trim()
    .custom(isValidCategory),

  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),

  query('featured')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Featured must be true or false'),

  query('visibility')
    .optional()
    .trim()
    .custom(isValidVisibility),

  query('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a string'),

  query('uploader')
    .optional()
    .custom(isValidObjectId),

  handleValidationErrors
];

export const resourceIdValidation = [
  param('id')
    .custom(isValidObjectId),

  handleValidationErrors
];

/**
 * Validate search query
 * GET /api/resources/search
 */
export const searchResourcesValidation = [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  handleValidationErrors
];

/**
 * Validate trending resources query
 * GET /api/resources/trending
 */
export const getTrendingValidation = [
  query('days')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Days must be between 1 and 365'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  handleValidationErrors
];

export const getMyResourcesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .trim()
    .isIn(['pending', 'approved', 'rejected', 'archived'])
    .withMessage('Status must be one of: pending, approved, rejected, archived'),

  handleValidationErrors
];

export default {
  createResourceValidation,
  updateResourceValidation,
  getResourcesValidation,
  resourceIdValidation,
  searchResourcesValidation,
  getTrendingValidation,
  getMyResourcesValidation,
  handleValidationErrors
};