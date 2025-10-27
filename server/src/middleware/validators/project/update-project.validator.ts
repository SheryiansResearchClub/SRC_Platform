import { validateResult } from "@/utils/validate";
import { param, body } from "express-validator";

export const updateProjectValidation = [
  param("id")
    .isMongoId()
    .withMessage("Project ID must be a valid MongoDB ObjectId"),

  body("title")
    .optional()
    .trim()
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("type")
    .optional()
    .isIn(['Web', 'AI', 'Electronics', 'Other'])
    .withMessage("Type must be one of: Web, AI, Electronics, Other"),

  body("status")
    .optional()
    .isIn(['ongoing', 'completed', 'paused', 'archived'])
    .withMessage("Status must be one of: ongoing, completed, paused, archived"),

  body("priority")
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage("Priority must be one of: low, medium, high, critical"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  body("expectedEndDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  body("actualEndDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((value) => {
      if (value.some((tag: unknown) => typeof tag !== 'string')) {
        throw new Error("Tags must be strings");
      }
      return true;
    }),

  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array")
    .custom((value) => {
      if (value.some((tech: unknown) => typeof tech !== 'string')) {
        throw new Error("Technologies must be strings");
      }
      return true;
    }),

  body("archived")
    .optional()
    .isBoolean()
    .withMessage("Archived must be a boolean"),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),

  validateResult,
];
