import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

export const createNotificationValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .isLength({ min: 3, max: 200 }).withMessage("Title must be between 3 and 200 characters"),

  body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isString().withMessage("Message must be a string")
    .isLength({ min: 10, max: 1000 }).withMessage("Message must be between 10 and 1000 characters"),

  body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(['task', 'comment', 'project', 'system', 'event', 'mention', 'deadline'])
    .withMessage("Invalid notification type"),

  body("actionUrl")
    .optional()
    /*.isURL().withMessage("Action URL must be a valid URL")*/,

  body("priority")
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage("Priority must be one of: low, medium, high"),

  validateResult,
];