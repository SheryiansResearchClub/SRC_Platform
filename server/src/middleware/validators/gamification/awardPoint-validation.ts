import { validateResult } from '@/utils/validate'
import { body } from 'express-validator'

export const awardPointsValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  body('points')
    .notEmpty()
    .withMessage('Points are required')
    .isInt({ min: 1 })
    .withMessage('Points must be a positive integer'),

  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Reason must be at least 3 characters long'),

  validateResult
]