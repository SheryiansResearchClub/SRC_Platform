import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

export const updateUserPasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .isString()
    .withMessage("Current password must be a string"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isString()
    .withMessage("New password must be a string")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .isString()
    .withMessage("Password confirmation must be a string")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),

  validateResult,
];
