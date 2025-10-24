import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

export const updateMilestoneValidation = [
  body("title")
    .optional()
    .trim()
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),

  body("completedAt")
    .optional()
    .isISO8601()
    .withMessage("Completed at must be a valid ISO 8601 date"),

  body("completedBy")
    .optional()
    .isMongoId()
    .withMessage("Completed by must be a valid MongoDB ObjectId"),

  validateResult,
];
