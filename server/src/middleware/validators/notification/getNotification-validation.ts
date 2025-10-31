import { validateResult } from "@/utils/validate";
import { query } from "express-validator";

export const getNotificationsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  query("type")
    .optional()
    .isIn(['task', 'comment', 'project', 'system', 'event', 'mention', 'deadline'])
    .withMessage("Invalid notification type"),

  query("read")
    .optional()
    .isIn(['true', 'false'])
    .withMessage("Read must be either 'true' or 'false'"),

  query("sortBy")
    .optional()
    .isString()
    .withMessage("SortBy must be a string"),

  query("sortOrder")
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage("SortOrder must be either 'asc' or 'desc'"),

  validateResult,
];