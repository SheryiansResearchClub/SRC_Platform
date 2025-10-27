import { validateResult } from "@/utils/validate";
import { body, param, query } from "express-validator";

export const createProjectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("type")
    .optional()
    .isIn(['Web', 'AI', 'Electronics', 'Other'])
    .withMessage("Type must be one of: 'Web', 'AI', 'Electronics', 'Other'"),

  body("status")
    .optional()
    .isIn(['ongoing', 'completed', 'paused', 'archived'])
    .withMessage("Status must be one of: 'ongoing', 'completed', 'paused', 'archived'"),

  body("priority")
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage("Priority must be one of: 'low', 'medium', 'high', 'critical'"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  body("expectedEndDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string"),

  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array"),

  body("technologies.*")
    .optional()
    .isString()
    .withMessage("Each technology must be a string"),

  validateResult,
];
