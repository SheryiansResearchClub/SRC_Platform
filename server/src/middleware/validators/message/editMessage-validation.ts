import { validateResult } from "@/utils/validate";
import { body, param } from "express-validator";

export const editMessageValidation = [
  param("id")
    .isMongoId()
    .withMessage("Message ID must be a valid MongoDB ObjectId"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Content must be between 1 and 2000 characters"),

  validateResult,
];