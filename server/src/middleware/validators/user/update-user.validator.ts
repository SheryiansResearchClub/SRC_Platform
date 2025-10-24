import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

export const updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 120 })
    .withMessage("Name must be between 2 and 120 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

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

  body("preferences.emailNotifications")
    .optional()
    .isBoolean()
    .withMessage("Email notifications preference must be a boolean"),

  body("preferences.pushNotifications")
    .optional()
    .isBoolean()
    .withMessage("Push notifications preference must be a boolean"),

  body("preferences.taskDeadlineReminder")
    .optional()
    .isInt({ min: 0, max: 168 })
    .withMessage("Task deadline reminder must be between 0 and 168 hours"),

  body("preferences.theme")
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage("Theme must be one of: light, dark, auto"),

  validateResult,
];
