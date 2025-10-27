import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

export const createTagValidation = [
  body('name')
    .notEmpty()
    .withMessage('Tag name is required')
    .isString()
    .withMessage('Tag name must be a string')
    .isLength({ max: 50 })
    .withMessage('Tag name must not exceed 50 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 200 })
    .withMessage('Description must not exceed 200 characters'),

  body('color')
    .optional()
    .isHexColor()
    .withMessage('Color must be a valid hex color'),

  body('type')
    .optional()
    .isIn(['project', 'task', 'general'])
    .withMessage('Type must be project, task, or general'),

  validateResult
];