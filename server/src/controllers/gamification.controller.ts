import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { gamificationService } from '@/services/gamification.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// GET /gamification/points/:userId - Get user points
const getUserPoints = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const points = await gamificationService.getUserPoints(userId);

    return sendSuccess(res, {
      points,
      message: 'User points retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_POINTS_FETCH_FAILED', error.message || 'Unable to fetch user points');
  }
};

// POST /gamification/points - Award points (system/admin)
const awardPoints = async (req: Request, res: Response) => {
  try {
    const { userId, points, reason } = req.body;

    const result = await gamificationService.awardPoints(userId, points, reason);

    return sendSuccess(res, {
      result,
      message: 'Points awarded successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'POINTS_AWARD_FAILED', error.message || 'Unable to award points');
  }
};

// GET /gamification/leaderboard - Get leaderboard
const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { period = 'all', limit = 20 } = req.query;
    const leaderboard = await gamificationService.getLeaderboard(
      period as string,
      parseInt(limit as string)
    );

    return sendSuccess(res, {
      leaderboard,
      message: 'Leaderboard retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'LEADERBOARD_FETCH_FAILED', error.message || 'Unable to fetch leaderboard');
  }
};

// GET /gamification/badges - Get all available badges
const getAllBadges = async (req: Request, res: Response) => {
  try {
    const badges = await gamificationService.getAllBadges();

    return sendSuccess(res, {
      badges,
      message: 'Badges retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'BADGES_FETCH_FAILED', error.message || 'Unable to fetch badges');
  }
};

// GET /gamification/badges/:userId - Get user badges
const getUserBadges = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const badges = await gamificationService.getUserBadges(userId);

    return sendSuccess(res, {
      badges,
      message: 'User badges retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_BADGES_FETCH_FAILED', error.message || 'Unable to fetch user badges');
  }
};

// POST /gamification/badges/:userId - Award badge to user
const awardBadge = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { badgeId } = req.body;

    const badge = await gamificationService.awardBadge(userId, badgeId);

    return sendSuccess(res, {
      badge,
      message: 'Badge awarded successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'BADGE_AWARD_FAILED', error.message || 'Unable to award badge');
  }
};

// GET /gamification/achievements/:userId - Get user achievements
const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const achievements = await gamificationService.getUserAchievements(userId);

    return sendSuccess(res, {
      achievements,
      message: 'User achievements retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_ACHIEVEMENTS_FETCH_FAILED', error.message || 'Unable to fetch user achievements');
  }
};

export default {
  getUserPoints,
  awardPoints,
  getLeaderboard,
  getAllBadges,
  getUserBadges,
  awardBadge,
  getUserAchievements,
};
