export type AuthJwtPayload = {
  userId: string;
  role: string;
}

export type { RateLimitRequestHandler } from 'express-rate-limit';

export interface EmailRateLimitResult {
  allowed: boolean;
  remaining?: number;
  resetAt?: Date;
  retryAfter?: number;
  message?: string;
}

// auth/isAuthenticate
export type { TokenPayload } from '@/types/lib';
export type { Server, Socket } from 'socket.io';