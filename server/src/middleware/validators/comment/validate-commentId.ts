import { param } from 'express-validator';
import { validateResult } from '@/utils/validate';

export const validateCommentId = [
  param('id')
    .isMongoId()
    .withMessage('Comment ID must be a valid MongoDB ObjectId'),
  validateResult
];
