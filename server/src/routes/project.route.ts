import express from 'express';
import projectController from '@/controllers/project.controller';
import validators from '@/middleware/validators';
import { authorize } from '@/middleware/auth/authorize';
import { apiRateLimiters } from '@/middleware/rate-limit';

const router = express.Router();

router.post(
  '/',
  validators.createProjectValidation,
  apiRateLimiters.createProject,
  projectController.createProject
);
/**
 * @openapi
 * /projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create a new project
 *     description: Creates a project and assigns the authenticated user as creator.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreateRequest'
 *     responses:
 *       '201':
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.get(
  '/',
  validators.getProjectsValidation,
  projectController.getProjects
);
/**
 * @openapi
 * /projects:
 *   get:
 *     tags: [Projects]
 *     summary: List projects
 *     description: Returns a paginated list of projects with optional filters.
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ongoing, completed, paused, archived]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Web, AI, Electronics, Other]
 *       - in: query
 *         name: search
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
 *         description: Projects fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectListResponse'
 */

router.get(
  '/:id',
  projectController.getProjectById
);
/**
 * @openapi
 * /projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get project by ID
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
 *         description: Project retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       '404':
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.put(
  '/:id',
  validators.updateProjectValidation,
  projectController.updateProject
);
/**
 * @openapi
 * /projects/{id}:
 *   put:
 *     tags: [Projects]
 *     summary: Update project details
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
 *             $ref: '#/components/schemas/ProjectUpdateRequest'
 *     responses:
 *       '200':
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       '404':
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.delete(
  '/:id',
  authorize('admin'),
  projectController.deleteProject
);
/**
 * @openapi
 * /projects/{id}:
 *   delete:
 *     tags: [Projects]
 *     summary: Delete a project
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
 *         description: Project deleted successfully
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
 *       '404':
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.post(
  '/:id/members',
  validators.assignMembersValidation,
  projectController.assignMembers
);
/**
 * @openapi
 * /projects/{id}/members:
 *   post:
 *     tags: [Projects]
 *     summary: Assign members to a project
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
 *             $ref: '#/components/schemas/ProjectAssignMembersRequest'
 *     responses:
 *       '200':
 *         description: Members assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 */

router.delete(
  '/:id/members/:userId',
  projectController.removeMember
);
/**
 * @openapi
 * /projects/{id}/members/{userId}:
 *   delete:
 *     tags: [Projects]
 *     summary: Remove a member from a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Member removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 */

router.get(
  '/:id/progress',
  projectController.getProjectProgress
);
/**
 * @openapi
 * /projects/{id}/progress:
 *   get:
 *     tags: [Projects]
 *     summary: Get project progress metrics
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
 *         description: Progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.put(
  '/:id/status',
  validators.updateProjectStatusValidation,
  projectController.updateProjectStatus
);
/**
 * @openapi
 * /projects/{id}/status:
 *   put:
 *     tags: [Projects]
 *     summary: Update project status
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
 *             $ref: '#/components/schemas/ProjectStatusUpdateRequest'
 *     responses:
 *       '200':
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 */

router.get(
  '/:id/milestones',
  projectController.getProjectMilestones
);
/**
 * @openapi
 * /projects/{id}/milestones:
 *   get:
 *     tags: [Projects]
 *     summary: List project milestones
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
 *         description: Milestones retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.post(
  '/:id/milestones',
  validators.createMilestoneValidation,
  projectController.createMilestone
);
/**
 * @openapi
 * /projects/{id}/milestones:
 *   post:
 *     tags: [Projects]
 *     summary: Create a project milestone
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
 *             $ref: '#/components/schemas/ProjectMilestoneCreateRequest'
 *     responses:
 *       '201':
 *         description: Milestone created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 */

router.put(
  '/:id/milestones/:milestoneId',
  validators.updateMilestoneValidation,
  projectController.updateMilestone
);
/**
 * @openapi
 * /projects/{id}/milestones/{milestoneId}:
 *   put:
 *     tags: [Projects]
 *     summary: Update a project milestone
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: milestoneId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectMilestoneUpdateRequest'
 *     responses:
 *       '200':
 *         description: Milestone updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 */

router.delete(
  '/:id/milestones/:milestoneId',
  projectController.deleteMilestone
);
/**
 * @openapi
 * /projects/{id}/milestones/{milestoneId}:
 *   delete:
 *     tags: [Projects]
 *     summary: Delete a project milestone
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: milestoneId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Milestone deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

export default router;
