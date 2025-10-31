import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

export const createCommentValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Content must be between 1 and 2000 characters"),

  body("project")
    .optional()
    .isMongoId()
    .withMessage("Project must be a valid MongoDB ObjectId"),

  body("task")
    .optional()
    .isMongoId()
    .withMessage("Task must be a valid MongoDB ObjectId"),

  body("parentComment")
    .optional()
    .isMongoId()
    .withMessage("Parent comment must be a valid MongoDB ObjectId"),

  body("mentions")
    .optional()
    .isArray()
    .withMessage("Mentions must be an array"),

  body("mentions.*")
    .optional()
    .isMongoId()
    .withMessage("Each mention must be a valid MongoDB ObjectId"),

  body("attachments")
    .optional()
    .isArray({ max: 5 })
    .withMessage("Attachments must be an array with maximum 5 items"),

  body("attachments.*.url")
    .optional()
    .isURL()
    .withMessage("Attachment URL must be a valid URL"),

  body("attachments.*.storageKey")
    .optional()
    .isString()
    .withMessage("Storage key must be a string"),

  body("attachments.*.mimeType")
    .optional()
    .isString()
    .matches(/^[^\/]+\/[^\/]+$/)
    .withMessage("MIME type must be in format 'type/subtype'"),

  body("attachments.*.filename")
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage("Filename must be a string with maximum 255 characters"),

  validateResult,
];