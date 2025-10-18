import type { RateLimitRequestHandler } from '@/types';
import rateLimit from 'express-rate-limit';
import { rateLimitConfig } from '@/config/rate-limit.config';
import { getClientIp, rateLimitHandler, withStore } from '@/utils/rate-limit';

export const searchRateLimiter: RateLimitRequestHandler = rateLimit({
  ...rateLimitConfig.search,
  ...withStore('search'),
  keyGenerator: (req) => req.user?._id?.toString() || getClientIp(req),
  handler: rateLimitHandler,
});