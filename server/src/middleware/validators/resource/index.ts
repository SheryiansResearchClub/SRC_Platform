import { validateResult } from "@/utils/validate";
import { body, param, query } from "express-validator";

export const createResourceValidation = [
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
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isString()
    .withMessage("Category must be a string")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category must be between 2 and 100 characters"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(['tutorial', 'document', 'snippet', 'template'])
    .withMessage("Type must be one of: tutorial, document, snippet, template"),

  body("tags")
    .notEmpty()
    .withMessage("Tags are required")
    .isArray({ min: 1 })
    .withMessage("At least one tag is required"),

  body("tags.*")
    .isString()
    .withMessage("Each tag must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Each tag must be between 2 and 50 characters"),

  body("difficulty")
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage("Difficulty must be one of: beginner, intermediate, advanced"),

  body("estimatedTime")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Estimated time must be between 1 and 1000 minutes"),

  body("githubUrl")
    .optional()
    .isURL()
    .withMessage("GitHub URL must be a valid URL"),

  body("demoUrl")
    .optional()
    .isURL()
    .withMessage("Demo URL must be a valid URL"),

  validateResult,
];

export const updateResourceValidation = [
  param("id")
    .isMongoId()
    .withMessage("Resource ID must be a valid MongoDB ObjectId"),

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
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string"),

  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category must be between 2 and 100 characters"),

  body("type")
    .optional()
    .isIn(['tutorial', 'document', 'snippet', 'template'])
    .withMessage("Type must be one of: tutorial, document, snippet, template"),

  body("tags")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one tag is required"),

  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Each tag must be between 2 and 50 characters"),

  validateResult,
];

export const getResourcesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),

  query("type")
    .optional()
    .isIn(['tutorial', 'document', 'snippet', 'template'])
    .withMessage("Type must be one of: tutorial, document, snippet, template"),

  validateResult,
];
