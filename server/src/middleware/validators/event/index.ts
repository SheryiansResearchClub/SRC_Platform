import { validateResult } from "@/utils/validate";
import { body, param, query } from "express-validator";

export const createEventValidation = [
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

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(['meeting', 'workshop', 'webinar', 'social', 'other'])
    .withMessage("Type must be one of: meeting, workshop, webinar, social, other"),

  body("location")
    .optional()
    .isString()
    .withMessage("Location must be a string")
    .isLength({ max: 500 })
    .withMessage("Location must not exceed 500 characters"),

  body("maxAttendees")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Max attendees must be between 1 and 1000"),

  validateResult,
];

export const updateEventValidation = [
  param("id")
    .isMongoId()
    .withMessage("Event ID must be a valid MongoDB ObjectId"),

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

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  body("type")
    .optional()
    .isIn(['meeting', 'workshop', 'webinar', 'social', 'other'])
    .withMessage("Type must be one of: meeting, workshop, webinar, social, other"),

  body("location")
    .optional()
    .isString()
    .withMessage("Location must be a string")
    .isLength({ max: 500 })
    .withMessage("Location must not exceed 500 characters"),

  body("maxAttendees")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Max attendees must be between 1 and 1000"),

  validateResult,
];

export const rsvpValidation = [
  param("id")
    .isMongoId()
    .withMessage("Event ID must be a valid MongoDB ObjectId"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(['yes', 'no', 'maybe'])
    .withMessage("Status must be one of: yes, no, maybe"),

  body("note")
    .optional()
    .isString()
    .withMessage("Note must be a string")
    .isLength({ max: 500 })
    .withMessage("Note must not exceed 500 characters"),

  validateResult,
];

export const getEventsValidation = [
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
    .isIn(['meeting', 'workshop', 'webinar', 'social', 'other'])
    .withMessage("Type must be one of: meeting, workshop, webinar, social, other"),

  query("status")
    .optional()
    .isIn(['active', 'cancelled', 'completed'])
    .withMessage("Status must be one of: active, cancelled, completed"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  validateResult,
];
