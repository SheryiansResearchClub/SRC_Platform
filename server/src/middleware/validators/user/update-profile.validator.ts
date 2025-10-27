import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

export const updateUserProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 120 })
    .withMessage("Name must be between 2 and 120 characters"),

  body("avatarUrl")
    .optional()
    .isString()
    .withMessage("Avatar URL must be a string"),

  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .isLength({ max: 1000 })
    .withMessage("Bio must not exceed 1000 characters"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),

  body("skills.*")
    .optional()
    .isString()
    .withMessage("Each skill must be a string"),

  validateResult,
];
