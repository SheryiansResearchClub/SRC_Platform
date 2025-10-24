import { validateResult } from "@/utils/validate";
import { query } from "express-validator";

export const getUsersValidation = [
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

  query("role")
    .optional()
    .isIn(['member', 'moderator', 'admin'])
    .withMessage("Role must be one of: member, moderator, admin"),

  query("status")
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage("Status must be one of: active, inactive, suspended"),

  query("sortBy")
    .optional()
    .isIn(['name', 'email', 'createdAt', 'lastActiveAt', 'projectCount', 'taskCount', 'points'])
    .withMessage("Sort by must be one of: name, email, createdAt, lastActiveAt, projectCount, taskCount, points"),

  query("sortOrder")
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage("Sort order must be either 'asc' or 'desc'"),

  validateResult,
];
