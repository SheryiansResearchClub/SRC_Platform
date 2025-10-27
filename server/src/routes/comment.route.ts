import express from 'express';
import { commentController } from '@/controllers/comment.controller';
import validators from '@/middleware/validators';
import { isAuthenticate } from '@/middleware/auth/isAuthenticate';
import { authorize } from '@/middleware/auth/authorize';
import { apiRateLimiters } from '@/middleware/rate-limit';

const router = express.Router();

router.post(
  '/',
  isAuthenticate,
  validators.createCommentValidation,
  apiRateLimiters.createComment,
  commentController.createComment
);
/**
 * @openapi
 * /comments:
 *   post:
 *     tags: [Comments]
 *     summary: Create a comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentCreateRequest'
 *     responses:
 *       '201':
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.get(
  '/',
  validators.getCommentsValidation,
  commentController.getComments
);
/**
 * @openapi
 * /comments:
 *   get:
 *     tags: [Comments]
 *     summary: List comments
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
 *         name: entityType
 *         schema:
 *           type: string
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       '200':
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentListResponse'
 */

router.get(
  '/:id',
  validators.validateCommentId,
  commentController.getCommentById
);
/**
 * @openapi
 * /comments/{id}:
 *   get:
 *     tags: [Comments]
 *     summary: Get comment by ID
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
 *         description: Comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       '404':
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.put(
  '/:id',
  isAuthenticate,
  validators.validateCommentId,
  validators.updateCommentValidation,
  commentController.updateComment
);
/**
 * @openapi
 * /comments/{id}:
 *   put:
 *     tags: [Comments]
 *     summary: Update a comment
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
 *             $ref: '#/components/schemas/CommentUpdateRequest'
 *     responses:
 *       '200':
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 */

router.delete(
  '/:id',
  isAuthenticate,
  validators.validateCommentId,
  commentController.deleteComment
);
/**
 * @openapi
 * /comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
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
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.put(
  '/:id/approve',
  isAuthenticate,
  authorize('admin', 'moderator'),
  validators.validateCommentId,
  commentController.approveComment
);
/**
 * @openapi
 * /comments/{id}/approve:
 *   put:
 *     tags: [Comments]
 *     summary: Approve a comment
 *     description: Only moderators or admins can approve comments.
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
 *         description: Comment approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.put(
  '/:id/reject',
  isAuthenticate,
  authorize('admin', 'moderator'),
  validators.validateCommentId,
  validators.rejectCommentValidation,
  commentController.rejectComment
);
/**
 * @openapi
 * /comments/{id}/reject:
 *   put:
 *     tags: [Comments]
 *     summary: Reject a comment
 *     description: Only moderators or admins can reject comments.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentModerationRequest'
 *     responses:
 *       '200':
 *         description: Comment rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

export default router;
