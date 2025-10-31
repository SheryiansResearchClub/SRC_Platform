import { validateResult } from "@/utils/validate";
import { body, param } from "express-validator";

export const updateCommentValidation = [
  param("id")
    .isMongoId()
    .withMessage("Comment ID must be a valid MongoDB ObjectId"),

  body("content")
    .optional()
    .trim()
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Content must be between 1 and 2000 characters"),

  validateResult,
];