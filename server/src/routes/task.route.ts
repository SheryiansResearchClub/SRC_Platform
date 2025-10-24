import express from 'express';
import taskController from '@/controllers/task.controller';
import validators from '@/middleware/validators';
import { apiRateLimiters } from '@/middleware/rate-limit';

const router = express.Router();

router.post(
  '/',
  validators.createTaskValidation,
  apiRateLimiters.createTask,
  taskController.createTask
);
/**
 * @openapi
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     description: Creates a task within a project.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateRequest'
 *     responses:
 *       '201':
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.get(
  '/',
  validators.getTasksValidation,
  taskController.getTasks
);
/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks
 *     description: Returns a paginated list of tasks with optional filters.
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
 *         name: assignee
 *         schema:
 *           type: string
 *       - in: query
 *         name: reporter
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tasks fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskListResponse'
 */

router.get(
  '/:id',
  validators.validateTaskId,
  taskController.getTaskById
);
/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task by ID
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
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       '404':
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.put(
  '/:id',
  validators.validateTaskId,
  validators.updateTaskValidation,
  taskController.updateTask
);
/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update task details
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
 *             $ref: '#/components/schemas/TaskUpdateRequest'
 *     responses:
 *       '200':
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 */

router.delete(
  '/:id',
  validators.validateTaskId,
  taskController.deleteTask
);
/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
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
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.put(
  '/:id/assign',
  validators.validateTaskId,
  validators.assignTaskValidation,
  taskController.assignTask
);
/**
 * @openapi
 * /tasks/{id}/assign:
 *   put:
 *     tags: [Tasks]
 *     summary: Assign or reassign a task
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
 *             $ref: '#/components/schemas/TaskAssignRequest'
 *     responses:
 *       '200':
 *         description: Task assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 */

router.put(
  '/:id/status',
  validators.validateTaskId,
  validators.updateTaskStatusValidation,
  taskController.updateTaskStatus
);
/**
 * @openapi
 * /tasks/{id}/status:
 *   put:
 *     tags: [Tasks]
 *     summary: Update task status
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
 *             $ref: '#/components/schemas/TaskStatusUpdateRequest'
 *     responses:
 *       '200':
 *         description: Task status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 */

router.put(
  '/:id/priority',
  validators.validateTaskId,
  validators.updateTaskPriorityValidation,
  taskController.updateTaskPriority
);
/**
 * @openapi
 * /tasks/{id}/priority:
 *   put:
 *     tags: [Tasks]
 *     summary: Update task priority
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
 *             $ref: '#/components/schemas/TaskPriorityUpdateRequest'
 *     responses:
 *       '200':
 *         description: Task priority updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 */

router.get(
  '/:id/history',
  validators.validateTaskId,
  taskController.getTaskHistory
);
/**
 * @openapi
 * /tasks/{id}/history:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task history
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
 *         description: Task history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

export default router;