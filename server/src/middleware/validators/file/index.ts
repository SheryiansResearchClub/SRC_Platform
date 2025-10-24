import { validateResult } from "@/utils/validate";
import { body, param, query } from "express-validator";

export const uploadFileValidation = [
  body("filename")
    .notEmpty()
    .withMessage("Filename is required")
    .isString()
    .withMessage("Filename must be a string")
    .isLength({ min: 1, max: 255 })
    .withMessage("Filename must be between 1 and 255 characters"),

  body("project")
    .optional()
    .isMongoId()
    .withMessage("Project must be a valid MongoDB ObjectId"),

  body("resourceType")
    .optional()
    .isIn(['document', 'image', 'video', 'audio', 'archive', 'other'])
    .withMessage("Resource type must be one of: document, image, video, audio, archive, other"),

  validateResult,
];

export const uploadFileVersionValidation = [
  param("id")
    .isMongoId()
    .withMessage("File ID must be a valid MongoDB ObjectId"),

  body("filename")
    .optional()
    .isString()
    .withMessage("Filename must be a string")
    .isLength({ min: 1, max: 255 })
    .withMessage("Filename must be between 1 and 255 characters"),

  validateResult,
];

export const getFilesValidation = [
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

  query("resourceType")
    .optional()
    .isIn(['document', 'image', 'video', 'audio', 'archive', 'other'])
    .withMessage("Resource type must be one of: document, image, video, audio, archive, other"),

  query("uploadedBy")
    .optional()
    .isMongoId()
    .withMessage("Uploaded by must be a valid MongoDB ObjectId"),

  validateResult,
];
