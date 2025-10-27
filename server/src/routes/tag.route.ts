import express from 'express';
import tagController from '@/controllers/tag.controller';
import validators from '@/middleware/validators';
import { authorize } from '@/middleware/auth/authorize';

const router = express.Router();

// POST /tags - Create new tag
router.post(
  '/',
  authorize('admin'),
  validators.createTagValidation, // Using existing validation for now
  tagController.createTag
);
/**
 * @openapi
 * /tags:
 *   post:
 *     tags: [Tags]
 *     summary: Create a new tag
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagCreateRequest'
 *     responses:
 *       '201':
 *         description: Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagResponse'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

// GET /tags - Get all tags
router.get(
  '/',
  validators.getTagsValidation, // Using existing validation for now
  tagController.getTags
);
/**
 * @openapi
 * /tags:
 *   get:
 *     tags: [Tags]
 *     summary: List tags
 *     description: Returns a paginated list of tags with optional filters.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [project, task, resource, general]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, usageCount, createdAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       '200':
 *         description: Tags retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagListResponse'
 */

// GET /tags/projects - Get project type tags (Web, Electronics, AI, etc.)
router.get(
  '/projects',
  tagController.getProjectTypeTags
);
/**
 * @openapi
 * /tags/projects:
 *   get:
 *     tags: [Tags]
 *     summary: List project type tags
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Project type tags retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagProjectTypeResponse'
 */

// GET /tags/:id - Get single tag
router.get(
  '/:id',
  validators.getTagByIdValidation,
  tagController.getTagById
);
/**
 * @openapi
 * /tags/{id}:
 *   get:
 *     tags: [Tags]
 *     summary: Get tag by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tag retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagResponse'
 *       '404':
 *         description: Tag not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

// PUT /tags/:id - Update tag
router.put(
  '/:id',
  authorize('admin'),
  validators.updateTagValidation, // Using existing validation for now
  tagController.updateTag
);
/**
 * @openapi
 * /tags/{id}:
 *   put:
 *     tags: [Tags]
 *     summary: Update a tag
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagUpdateRequest'
 *     responses:
 *       '200':
 *         description: Tag updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagResponse'
 *       '404':
 *         description: Tag not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

// DELETE /tags/:id - Delete tag
router.delete(
  '/:id',
  authorize('admin'),
  validators.getTagByIdValidation,
  tagController.deleteTag
);
/**
 * @openapi
 * /tags/{id}:
 *   delete:
 *     tags: [Tags]
 *     summary: Delete a tag
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tag deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 *       '404':
 *         description: Tag not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

export default router;
