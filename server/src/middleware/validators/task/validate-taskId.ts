import { param } from 'express-validator';
import { validateResult } from '@/utils/validate';

export const validateTaskId = [
  param('id')
    .isMongoId()
    .withMessage('Task ID must be a valid MongoDB ObjectId'),
  validateResult
];
