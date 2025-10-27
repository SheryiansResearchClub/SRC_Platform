import { validateResult } from "@/utils/validate";
import { body, param, query } from "express-validator";

export const sendMessageValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Content must be between 1 and 2000 characters"),

  body("recipient")
    .optional()
    .isMongoId()
    .withMessage("Recipient must be a valid MongoDB ObjectId"),

  body("project")
    .optional()
    .isMongoId()
    .withMessage("Project must be a valid MongoDB ObjectId"),

  body("messageType")
    .optional()
    .isIn(['text', 'file', 'image'])
    .withMessage("Message type must be one of: text, file, image"),

  validateResult,
];

export const editMessageValidation = [
  param("id")
    .isMongoId()
    .withMessage("Message ID must be a valid MongoDB ObjectId"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Content must be between 1 and 2000 characters"),

  validateResult,
];

export const getMessagesValidation = [
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

  query("recipient")
    .optional()
    .isMongoId()
    .withMessage("Recipient must be a valid MongoDB ObjectId"),

  query("sender")
    .optional()
    .isMongoId()
    .withMessage("Sender must be a valid MongoDB ObjectId"),

  validateResult,
];
