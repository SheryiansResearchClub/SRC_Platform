import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

export const awardBadgeValidation = [
  body('badgeId')
    .notEmpty()
    .withMessage('Badge ID is required')
    .isMongoId()
    .withMessage('Invalid badge ID format'),

  body('reason')
    .optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage('Reason must be at least 3 characters long'),

  validateResult
]