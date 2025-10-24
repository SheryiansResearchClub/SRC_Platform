import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { userService } from '@/services/user.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);

    const userObj = user.toObject();
    const { password: _password, refreshTokens: _refreshTokens, ...sanitizedUser } = userObj;

    return sendSuccess(res, {
      user: sanitizedUser,
      message: 'User created successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'USER_CREATE_FAILED', error.message || 'Unable to create user');
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      search: req.query.search as string | undefined,
      role: req.query.role as string | undefined,
      status: req.query.status as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await userService.getUsers(query);

    return sendSuccess(res, {
      users: result.users.map(user => {
        const userObj = user.toObject();
        const { password: _password, refreshTokens: _refreshTokens, ...sanitizedUser } = userObj;
        return sanitizedUser;
      }),
      pagination: {
        page: result.page,
        limit: query.limit || 10,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_FETCH_FAILED', error.message || 'Unable to fetch users');
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    const userObj = user.toObject();
    const { password: _password, refreshTokens: _refreshTokens, ...sanitizedUser } = userObj;

    return sendSuccess(res, {
      user: sanitizedUser,
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_FETCH_FAILED', error.message || 'Unable to fetch user');
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUser(id, req.body, req.user);

    const userObj = updatedUser.toObject();
    const { password: _password, refreshTokens: _refreshTokens, ...sanitizedUser } = userObj;

    return sendSuccess(res, {
      user: sanitizedUser,
      message: 'User updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_UPDATE_FAILED', error.message || 'Unable to update user');
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id, req.user!);

    return sendSuccess(res, {
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_DELETE_FAILED', error.message || 'Unable to delete user');
  }
};

const getUserProjects = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projects = await userService.getUserProjects(id);

    return sendSuccess(res, {
      projects,
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_PROJECTS_FETCH_FAILED', error.message || 'Unable to fetch user projects');
  }
};

const getUserTasks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tasks = await userService.getUserTasks(id);

    return sendSuccess(res, {
      tasks,
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_TASKS_FETCH_FAILED', error.message || 'Unable to fetch user tasks');
  }
};

const getUserStatistics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const statistics = await userService.getUserStatistics(id);

    return sendSuccess(res, {
      statistics,
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_STATS_FETCH_FAILED', error.message || 'Unable to fetch user statistics');
  }
};

const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const achievements = await userService.getUserAchievements(id);

    return sendSuccess(res, {
      achievements,
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_ACHIEVEMENTS_FETCH_FAILED', error.message || 'Unable to fetch user achievements');
  }
};

const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updatedUser = await userService.updateUserRole(id, role, req.user!);

    const userObj = updatedUser.toObject();
    const { password: _password, refreshTokens: _refreshTokens, ...sanitizedUser } = userObj;

    return sendSuccess(res, {
      user: sanitizedUser,
      message: 'User role updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_ROLE_UPDATE_FAILED', error.message || 'Unable to update user role');
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUserProfile(id, {
      name: req.body.name,
      avatarUrl: req.body.avatarUrl,
      bio: req.body.bio,
      skills: req.body.skills,
    }, req.user!);

    const userObj = updatedUser.toObject();
    const { password: _password, refreshTokens: _refreshTokens, ...sanitizedUser } = userObj;

    return sendSuccess(res, {
      user: sanitizedUser,
      message: 'User profile updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_PROFILE_UPDATE_FAILED', error.message || 'Unable to update user profile');
  }
};

const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.updateUserPassword(id, req.body, req.user!);

    return sendSuccess(res, {
      message: 'Password updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'USER_PASSWORD_UPDATE_FAILED', error.message || 'Unable to update password');
  }
};

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProjects,
  getUserTasks,
  getUserStatistics,
  getUserAchievements,
  updateUserRole,
  updateUserProfile,
  updateUserPassword,
};
