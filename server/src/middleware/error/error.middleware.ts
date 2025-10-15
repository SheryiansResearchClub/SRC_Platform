import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors';
import { sendError } from '@/utils/response';
import { logger } from '@/utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    return sendError(res, err.code, err.message, err.statusCode, err.details);
  }

  if (err.name === 'ValidationError') {
    return sendError(res, 'VALIDATION_ERROR', err.message, 400);
  }
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    return sendError(res, 'DUPLICATE_ERROR', 'Resource already exists', 409);
  }

  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'INVALID_TOKEN', 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'TOKEN_EXPIRED', 'Token expired', 401);
  }

  return sendError(res, 'INTERNAL_ERROR', 'Internal server error', 500);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return sendError(res, 'NOT_FOUND', `Route ${req.originalUrl} not found`, 404);
};