import { validateResult } from "@/utils/validate";
import { param } from "express-validator";

export const getTagByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Tag ID is required')
    .isMongoId()
    .withMessage('Tag ID must be a valid Mongo ID'),

  validateResult
];