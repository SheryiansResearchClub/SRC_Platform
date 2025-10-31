import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

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