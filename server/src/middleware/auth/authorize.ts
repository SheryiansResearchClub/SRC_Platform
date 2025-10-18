import type { Request, Response, NextFunction, JwtPayload } from '@/types';
import { UnauthorizedError, ForbiddenError } from '@/utils/errors';

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
};