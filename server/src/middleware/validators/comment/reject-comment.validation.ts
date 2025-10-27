import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

export const rejectCommentValidation = [
  body("reason")
    .notEmpty()
    .withMessage("Reason is required")
    .isString()
    .withMessage("Reason must be a string")
    .isLength({ min: 10, max: 500 })
    .withMessage("Reason must be between 10 and 500 characters"),

  validateResult,
];