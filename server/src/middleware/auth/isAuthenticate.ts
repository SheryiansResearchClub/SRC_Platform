import type { Request, Response, NextFunction } from '@/types';
import jwt from 'jsonwebtoken';
import { userRepo } from '@/repositories/user.repository';
import { UnauthorizedError } from '@/utils/errors';
import { getTokenFromRequest, isTokenBlacklisted, getCachedUser, cacheUser } from '@/utils/token';
import { jwtService } from '@/lib/auth/jwt';

export const isAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    if (await isTokenBlacklisted(token)) {
      throw new UnauthorizedError('Token has been revoked');
    }

    const decoded = jwtService.verifyAccessToken(token);
    const userId = decoded.userId;


    if (!userId) {
      throw new UnauthorizedError('Invalid token payload');
    }

    let user = await getCachedUser(userId);

    if (!user) {
      user = await userRepo.findById(userId);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      if (user.status !== 'active') {
        throw new UnauthorizedError('Account is not active');
      }

      const ttlSeconds = decoded.exp ? Math.max(Math.floor(decoded.exp - Date.now() / 1000), 0) : undefined;
      await cacheUser(user, ttlSeconds && ttlSeconds > 0 ? ttlSeconds : undefined);
    } else if (user.status !== 'active') {
      throw new UnauthorizedError('Account is not active');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Access token has expired'));
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid access token'));
      return;
    }

    next(error);
  }
};