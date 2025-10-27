import { validateResult } from "@/utils/validate";
import { query } from "express-validator";

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