import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

export const createUserValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 120 })
    .withMessage("Name must be between 2 and 120 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .optional()
    .isIn(['member', 'moderator', 'admin'])
    .withMessage("Role must be one of: member, moderator, admin"),

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
