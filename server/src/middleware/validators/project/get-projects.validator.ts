import { validateResult } from "@/utils/validate";
import { query } from "express-validator";

export const getProjectsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string")
    .isLength({ max: 100 })
    .withMessage("Search query must not exceed 100 characters"),

  query("type")
    .optional()
    .isIn(['Web', 'AI', 'Electronics', 'Other'])
    .withMessage("Type must be one of: 'Web', 'AI', 'Electronics', 'Other'"),

  query("status")
    .optional()
    .isIn(['ongoing', 'completed', 'paused', 'archived'])
    .withMessage("Status must be one of: ongoing', 'completed', 'paused', 'archived'"),

  query("priority")
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage("Priority must be one of: 'low', 'medium', 'high', 'critical'"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  query("expectedEndDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  query("createdBy")
    .optional()
    .isMongoId()
    .withMessage("Created By must be a valid MongoDB ObjectId"),

  query("sortBy")
    .optional()
    .isIn(['title', 'createdAt', 'updatedAt', 'startDate', 'endDate', 'budget', 'status', 'priority'])
    .withMessage("Sort by must be one of: title, createdAt, updatedAt, startDate, endDate, budget, status, priority"),

  query("sortOrder")
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage("Sort order must be either 'asc' or 'desc'"),

  validateResult,
];
