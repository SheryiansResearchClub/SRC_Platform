import { validateResult } from "@/utils/validate";
import { param, body } from "express-validator";

export const updateProjectStatusValidation = [
  param("id")
    .isMongoId()
    .withMessage("Project ID must be a valid MongoDB ObjectId"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(['ongoing', 'completed', 'paused', 'archived'])
    .withMessage("Status must be one of: 'ongoing', 'completed', 'paused', 'archived'"),

  validateResult,
];
