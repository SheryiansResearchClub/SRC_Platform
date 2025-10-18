import rateLimit from 'express-rate-limit';
import { rateLimitConfig } from '@/config/rate-limit.config';
import { getClientIp, rateLimitHandler, withStore } from '@/utils/rate-limit';

export const authRateLimiters = {
  login: rateLimit({
    ...rateLimitConfig.auth.login,
    ...withStore('auth:login'),
    keyGenerator: (req) => getClientIp(req),
    handler: rateLimitHandler,
    skipFailedRequests: true,
  }),

  register: rateLimit({
    ...rateLimitConfig.auth.register,
    ...withStore('auth:register'),
    keyGenerator: (req) => getClientIp(req),
    handler: rateLimitHandler,
  }),

  forgotPassword: rateLimit({
    ...rateLimitConfig.auth.forgotPassword,
    ...withStore('auth:forgot-password'),
    keyGenerator: (req) => getClientIp(req),
    handler: rateLimitHandler,
  }),

  verifyEmail: rateLimit({
    ...rateLimitConfig.auth.verifyEmail,
    ...withStore('auth:verify-email'),
    keyGenerator: (req) => getClientIp(req),
    handler: rateLimitHandler,
  }),

  refreshToken: rateLimit({
    ...rateLimitConfig.auth.refreshToken,
    ...withStore('auth:refresh-token'),
    keyGenerator: (req) => getClientIp(req),
    handler: rateLimitHandler,
  }),
};