import express from 'express';
import searchController from '@/controllers/search.controller';
import validators from '@/middleware/validators';
import { apiRateLimiters } from '@/middleware/rate-limit';

const router = express.Router();

// GET /search/projects - Search projects
router.get(
  '/projects',
  validators.getUsersValidation, // Using existing validation for now
  apiRateLimiters.createTask, // Using existing rate limiter
  searchController.searchProjects
);

// GET /search/members - Search members
router.get(
  '/members',
  validators.getUsersValidation, // Using existing validation for now
  searchController.searchMembers
);

// GET /search/files - Search files
router.get(
  '/files',
  validators.getUsersValidation, // Using existing validation for now
  searchController.searchFiles
);

// GET /search/comments - Search comments
router.get(
  '/comments',
  validators.getUsersValidation, // Using existing validation for now
  searchController.searchComments
);

// GET /search/resources - Search resources
router.get(
  '/resources',
  validators.getUsersValidation, // Using existing validation for now
  searchController.searchResources
);

// GET /search/global - Global search across all entities
router.get(
  '/global',
  validators.getUsersValidation, // Using existing validation for now
  searchController.globalSearch
);

export default router;
