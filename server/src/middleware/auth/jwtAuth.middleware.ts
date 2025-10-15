import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '@/config/app.config';
import { UnauthorizedError, ForbiddenError } from '@/utils/errors';
import { User } from '@/models/user.model';

interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, appConfig.jwt.secret) as JwtPayload;

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Account is not active');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
};