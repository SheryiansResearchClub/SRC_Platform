import express from 'express'
import gamificationController from '@/controllers/gamification.controller'
import validators from '@/middleware/validators'
import { authorize } from '@/middleware/auth/authorize'

const router = express.Router()

// GET /gamification/points/:userId - Get user points
router.get('/points/:userId', gamificationController.getUserPoints)
/**
 * @openapi
 * /gamification/points/{userId}:
 *   get:
 *     tags: [Gamification]
 *     summary: Get a user's gamification points summary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Points retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GamificationPointsResponse'
 */

// POST /gamification/points - Award points (admin/system only)
router.post(
  '/points',
  authorize('admin'),
  validators.awardPointsValidation,
  gamificationController.awardPoints
)
/**
 * @openapi
 * /gamification/points:
 *   post:
 *     tags: [Gamification]
 *     summary: Award points to a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GamificationAwardPointsRequest'
 *     responses:
 *       '200':
 *         description: Points awarded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GamificationPointsResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

// GET /gamification/leaderboard - Get leaderboard
router.get('/leaderboard', gamificationController.getLeaderboard)
/**
 * @openapi
 * /gamification/leaderboard:
 *   get:
 *     tags: [Gamification]
 *     summary: Get the gamification leaderboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Leaderboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GamificationLeaderboardResponse'
 */

// GET /gamification/badges - Get all badges
router.get('/badges', gamificationController.getAllBadges)
/**
 * @openapi
 * /gamification/badges:
 *   get:
 *     tags: [Gamification]
 *     summary: List all available badges
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Badges retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GamificationBadgeListResponse'
 */

// GET /gamification/badges/:userId - Get user badges
router.get('/badges/:userId', gamificationController.getUserBadges)
/**
 * @openapi
 * /gamification/badges/{userId}:
 *   get:
 *     tags: [Gamification]
 *     summary: Get badges awarded to a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User badges retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GamificationBadgeListResponse'
 */

// POST /gamification/badges/:userId - Award badge to user
router.post(
  '/badges/:userId',
  authorize('admin'),
  validators.awardBadgeValidation,
  gamificationController.awardBadge
)
/**
 * @openapi
 * /gamification/badges/{userId}:
 *   post:
 *     tags: [Gamification]
 *     summary: Award a badge to a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GamificationAwardBadgeRequest'
 *     responses:
 *       '200':
 *         description: Badge awarded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GamificationBadgeListResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiMessageResponse'
 */

// GET /gamification/achievements/:userId - Get user achievements
router.get('/achievements/:userId', gamificationController.getUserAchievements)
/**
 * @openapi
 * /gamification/achievements/{userId}:
 *   get:
 *     tags: [Gamification]
 *     summary: Get a user's achievements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Achievements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GamificationAchievementsResponse'
 */

export default router
