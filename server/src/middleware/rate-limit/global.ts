import type { Request, RateLimitRequestHandler } from '@/types';
import rateLimit from 'express-rate-limit';
import { rateLimitConfig } from '@/config/rate-limit.config';
import { getClientIp, rateLimitHandler, withStore } from '@/utils/rate-limit';

export const globalRateLimiter: RateLimitRequestHandler = rateLimit({
  ...rateLimitConfig.global,
  ...withStore('global'),
  keyGenerator: (req) => getClientIp(req),
  handler: rateLimitHandler,
  skip: (req: Request) => req.path === '/health' || req.path === '/api/health',
});