import type { Socket } from '@/types';
import { UnauthorizedError } from '@/utils/errors';
import { jwtService } from '@/lib/auth/jwt';
import * as cookie from 'cookie';

export const isAuthenticate = (
  socket: Socket,
  next: (err?: Error) => void
): void => {
  try {
    const token = socket.handshake.auth?.token || extractTokenFromCookies(socket.handshake.headers.cookie);

    if (!token) {
      return next(new UnauthorizedError('Authentication token not found'));
    }

    const decoded = jwtService.verifyAccessToken(token);

    socket.data = {
      ...socket.data,
      user: decoded,
      authenticatedAt: new Date().toISOString(),
    };

    next();
  } catch (error) {
    handleAuthenticationError(error, next);
  }
};

function extractTokenFromCookies(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;

  try {
    const cookies = cookie.parse(cookieHeader);
    return cookies.accessToken || null;
  } catch (error) {
    console.error('Error parsing cookies:', error);
    return null;
  }
}

function handleAuthenticationError(error: unknown, next: (err?: Error) => void): void {
  if (error instanceof Error) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token has expired'));
    }

    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token format'));
    }

    if (error.name === 'NotBeforeError') {
      return next(new UnauthorizedError('Token not yet valid'));
    }

    return next(new UnauthorizedError(error.message));
  }

  return next(new UnauthorizedError('Authentication failed'));
}