import { validateResult } from "@/utils/validate";
import { body, param, query } from "express-validator";

export const createNotificationValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isString()
    .withMessage("Message must be a string")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(['info', 'success', 'warning', 'error'])
    .withMessage("Type must be one of: info, success, warning, error"),

  body("recipient")
    .notEmpty()
    .withMessage("Recipient is required")
    .isMongoId()
    .withMessage("Recipient must be a valid MongoDB ObjectId"),

  body("entityType")
    .optional()
    .isString()
    .withMessage("Entity type must be a string"),

  body("entityId")
    .optional()
    .isMongoId()
    .withMessage("Entity ID must be a valid MongoDB ObjectId"),

  body("actionUrl")
    .optional()
    .isURL()
    .withMessage("Action URL must be a valid URL"),

  body("priority")
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage("Priority must be one of: low, medium, high"),

  validateResult,
];

export const getNotificationsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("type")
    .optional()
    .isIn(['info', 'success', 'warning', 'error'])
    .withMessage("Type must be one of: info, success, warning, error"),

  query("read")
    .optional()
    .isIn(['true', 'false'])
    .withMessage("Read must be either 'true' or 'false'"),

  validateResult,
];
