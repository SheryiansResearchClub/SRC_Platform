import express from 'express';
import messageController from '@/controllers/message.controller';
import validators from '@/middleware/validators';

const router = express.Router();

router.post(
  '/',
  validators.sendMessageValidation,
  messageController.sendMessage
);
/**
 * @openapi
 * /messages:
 *   post:
 *     tags: [Messages]
 *     summary: Send a message
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageCreateRequest'
 *     responses:
 *       '201':
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.get(
  '/',
  validators.getMessagesValidation,
  messageController.getMessages
);
/**
 * @openapi
 * /messages:
 *   get:
 *     tags: [Messages]
 *     summary: List messages
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
 *         name: project
 *         schema:
 *           type: string
 *       - in: query
 *         name: recipient
 *         schema:
 *           type: string
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       '200':
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageListResponse'
 */

router.get(
  '/:id',
  validators.mongoIdValidator,
  messageController.getMessageById
);
/**
 * @openapi
 * /messages/{id}:
 *   get:
 *     tags: [Messages]
 *     summary: Get message by ID
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
 *         description: Message retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       '404':
 *         description: Message not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.put(
  '/:id',
  validators.mongoIdValidator,
  validators.editMessageValidation,
  messageController.editMessage
);
/**
 * @openapi
 * /messages/{id}:
 *   put:
 *     tags: [Messages]
 *     summary: Edit a message
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
 *             $ref: '#/components/schemas/MessageUpdateRequest'
 *     responses:
 *       '200':
 *         description: Message updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

router.delete(
  '/:id',
  validators.mongoIdValidator,
  messageController.deleteMessage
);
/**
 * @openapi
 * /messages/{id}:
 *   delete:
 *     tags: [Messages]
 *     summary: Delete a message
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
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

// router.get(
//   '/conversations',
//   messageController.getUserConversations
// );

router.put(
  '/:id/read',
  validators.mongoIdValidator,
  messageController.markAsRead
);
/**
 * @openapi
 * /messages/{id}/read:
 *   put:
 *     tags: [Messages]
 *     summary: Mark a message as read
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
 *         description: Message marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

export default router;