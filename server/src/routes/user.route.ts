import express from 'express';
import userController from '@/controllers/user.controller';
import validators from '@/middleware/validators';
import { authorize } from '@/middleware/auth/authorize';
import { apiRateLimiters } from '@/middleware/rate-limit';

const router = express.Router();

router.post(
  '/',
  authorize('admin'),
  validators.createUserValidation,
  userController.createUser
);
/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Admin-only endpoint to create users manually.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
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

router.get("/currentUser",
  userController.getCurrentUser)
/**
 * @openapi
 * /users/currentUser:
 *   get:
 *     tags: [Users]
 *     summary: Get current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Current user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */

router.get(
  '/',
  validators.getUsersValidation,
  userController.getUsers
);
/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     description: Returns a paginated list of users.
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
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [member, moderator, admin]
 *       - in: query
 *         name: status
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
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUsers'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.get(
  '/:id',
  userController.getUserById
);
/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID
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
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.put(
  '/:id',
  validators.updateUserValidation,
  userController.updateUser
);
/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user details
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
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.delete(
  '/:id',
  authorize('admin'),
  userController.deleteUser
);
/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
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
 *         description: User deleted successfully
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.get(
  '/:id/projects',
  userController.getUserProjects
);
/**
 * @openapi
 * /users/{id}/projects:
 *   get:
 *     tags: [Users]
 *     summary: Get projects assigned to a user
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
 *         description: Projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.get(
  '/:id/tasks',
  userController.getUserTasks
);
/**
 * @openapi
 * /users/{id}/tasks:
 *   get:
 *     tags: [Users]
 *     summary: Get tasks assigned to a user
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
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

// GET /users/:id/statistics - Get user contribution stats
router.get(
  '/:id/statistics',
  userController.getUserStatistics
);
/**
 * @openapi
 * /users/{id}/statistics:
 *   get:
 *     tags: [Users]
 *     summary: Get user statistics
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
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

// GET /users/:id/achievements - Get user badges/achievements
router.get(
  '/:id/achievements',
  userController.getUserAchievements
);
/**
 * @openapi
 * /users/{id}/achievements:
 *   get:
 *     tags: [Users]
 *     summary: Get user achievements
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
 *         description: Achievements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

// PUT /users/:id/role - Update user role (admin only)
router.put(
  '/:id/role',
  authorize('admin'),
  validators.updateUserRoleValidation,
  userController.updateUserRole
);
/**
 * @openapi
 * /users/{id}/role:
 *   put:
 *     tags: [Users]
 *     summary: Update user role
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
 *             $ref: '#/components/schemas/UserRoleUpdateRequest'
 *     responses:
 *       '200':
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.put(
  '/:id/profile',
  validators.updateUserProfileValidation,
  apiRateLimiters.updateProfile,
  userController.updateUserProfile
);
/**
 * @openapi
 * /users/{id}/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
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
 *             $ref: '#/components/schemas/UserProfileUpdateRequest'
 *     responses:
 *       '200':
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

router.put(
  '/:id/password',
  validators.updateUserPasswordValidation,
  userController.updateUserPassword
);
/**
 * @openapi
 * /users/{id}/password:
 *   put:
 *     tags: [Users]
 *     summary: Change user password
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
 *             $ref: '#/components/schemas/UserPasswordUpdateRequest'
 *     responses:
 *       '200':
 *         description: Password updated successfully
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

export default router;
