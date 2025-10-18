import { validateResult } from "@/utils/validate";
import { query } from "express-validator";

export const oauthValidation = [
  query("code")
    .trim()
    .notEmpty()
    .withMessage("Code is required")
    .isString()
    .withMessage("Code must be a string")
    .isLength({ min: 1 })
    .withMessage("Code must be a 1 character string"),

  validateResult,
];