import { validateResult } from "@/utils/validate";
import { param, body, query } from "express-validator";

export const updateTaskValidation = [
  param("id")
    .isMongoId()
    .withMessage("Task ID must be a valid MongoDB ObjectId"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot be longer than 1000 characters"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("Assigned user ID must be a valid MongoDB ObjectId"),

  validateResult,
];

export const updateTaskStatusValidation = [
  param("id")
    .isMongoId()
    .withMessage("Task ID must be a valid MongoDB ObjectId"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(['todo', 'in-progress', 'review', 'completed'])
    .withMessage("Status must be one of: todo, in-progress, review, completed"),

  validateResult,
];

export const updateTaskPriorityValidation = [
  param("id")
    .isMongoId()
    .withMessage("Task ID must be a valid MongoDB ObjectId"),

  body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage("Priority must be one of: low, medium, high, urgent"),

  validateResult,
];

export const assignTaskValidation = [
  param("id")
    .isMongoId()
    .withMessage("Task ID must be a valid MongoDB ObjectId"),

  body("assignee")
    .notEmpty()
    .withMessage("Assignee is required")
    .isMongoId()
    .withMessage("Assignee must be a valid MongoDB ObjectId"),

  validateResult,
];

export const getTasksValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("project")
    .optional()
    .isMongoId()
    .withMessage("Project must be a valid MongoDB ObjectId"),

  query("assignee")
    .optional()
    .isMongoId()
    .withMessage("Assignee must be a valid MongoDB ObjectId"),

  query("status")
    .optional()
    .isIn(['todo', 'in-progress', 'review', 'completed'])
    .withMessage("Status must be one of: todo, in-progress, review, completed"),

  query("priority")
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage("Priority must be one of: low, medium, high, urgent"),

  validateResult,
];
