import { validateResult } from "@/utils/validate";
import { body } from "express-validator";

export const updateUserRoleValidation = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(['member', 'moderator', 'admin'])
    .withMessage("Role must be one of: member, moderator, admin"),

  validateResult,
];
