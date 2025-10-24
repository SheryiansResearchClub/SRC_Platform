import { validateResult } from "@/utils/validate";
import { body, param, query } from "express-validator";

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

  validateResult,
];

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

export const rejectCommentValidation = [
  param("id")
    .isMongoId()
    .withMessage("Comment ID must be a valid MongoDB ObjectId"),

  body("reason")
    .notEmpty()
    .withMessage("Reason is required")
    .isString()
    .withMessage("Reason must be a string")
    .isLength({ min: 10, max: 500 })
    .withMessage("Reason must be between 10 and 500 characters"),

  validateResult,
];

export const getCommentsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("project")
    .optional()
    .isMongoId()
    .withMessage("Project must be a valid MongoDB ObjectId"),

  query("task")
    .optional()
    .isMongoId()
    .withMessage("Task must be a valid MongoDB ObjectId"),

  query("status")
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage("Status must be one of: pending, approved, rejected"),

  validateResult,
];
