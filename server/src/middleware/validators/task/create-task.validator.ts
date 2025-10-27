import { validateResult } from "@/utils/validate";
import { body, param, query } from "express-validator";

export const createTaskValidation = [
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

  body("project")
    .optional()
    .isMongoId()
    .withMessage("Project must be a valid MongoDB ObjectId"),

  body("assignee")
    .optional()
    .isMongoId()
    .withMessage("Assignee must be a valid MongoDB ObjectId"),

  body("priority")
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage("Priority must be one of: low, medium, high, urgent"),

  body("status")
    .optional()
    .isIn(['todo', 'in-progress', 'review', 'completed'])
    .withMessage("Status must be one of: todo, in-progress, review, completed"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),

  body("estimatedHours")
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage("Estimated hours must be a positive number"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string"),

  validateResult,
];
