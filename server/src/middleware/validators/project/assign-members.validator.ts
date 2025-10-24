import { body, param } from "express-validator";
import { validateResult } from "@/utils/validate";

export const assignMembersValidation = [
  param("id")
    .isMongoId()
    .withMessage("Project ID must be a valid MongoDB ObjectId"),

  body("members")
    .isArray({ min: 1 })
    .withMessage("Members must be a non-empty array"),

  body("members.*.user")
    .isMongoId()
    .withMessage("Each member's user must be a valid MongoDB ObjectId"),

  body("members.*.role")
    .optional()
    .isIn(["member", "maintainer", "owner"])
    .withMessage("Role must be one of: member, maintainer, owner"),

  validateResult,
];
