import { validateResult } from "@/utils/validate";
import { query } from "express-validator";

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