import { validateResult } from "@/utils/validate";
import { query } from "express-validator";

export const getTagsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('type')
    .optional()
    .isIn(['project', 'task', 'general'])
    .withMessage('Type must be project, task, or general'),

  query('sortBy')
    .optional()
    .isIn(['name', 'usageCount', 'createdAt'])
    .withMessage('sortBy must be name, usageCount, or createdAt'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),

  validateResult
];