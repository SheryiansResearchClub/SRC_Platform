import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import type { Request, Response } from 'express';
import RedisStore from 'rate-limit-redis';
import type { RedisClientType } from 'redis';

import { rateLimitConfig } from '@/config/rate-limit.config';
import { redisClient, isRedisEnabled } from '@/lib/db/redis';
import { logger } from '@/utils/logger';

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown';
  return ip;
}

function withStore(prefix: string) {
  const store = createRedisStore(prefix);
  return store ? { store } : {};
}

function createRedisStore(prefix: string) {
  if (!isRedisEnabled) {
    return null;
  }
  const client = redisClient as RedisClientType;

  return new RedisStore({
    sendCommand: async (...args: string[]) => {
      if (!client.isOpen) {
        await client.connect();
      }

      const command = args.map((arg) => (typeof arg === 'string' ? arg : String(arg)));
      return client.sendCommand(command as unknown as never);
    },
    prefix: `rate-limit:${prefix}:`,
  });
}

const rateLimitHandler = (req: Request, res: Response) => {
  logger.warn('Rate limit exceeded', {
    ip: getClientIp(req),
    path: req.path,
    method: req.method,
  });

  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  });
};

export const globalRateLimiter: RateLimitRequestHandler = rateLimit({
  ...rateLimitConfig.global,
  ...withStore('global'),
  keyGenerator: (req) => getClientIp(req),
  handler: rateLimitHandler,
  skip: (req: Request) => req.path === '/health' || req.path === '/api/health',
});

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

export const apiRateLimiters = {
  createProject: rateLimit({
    ...rateLimitConfig.api.createProject,
    ...withStore('api:create-project'),
    keyGenerator: (req) => req.user?._id?.toString() || getClientIp(req),
    handler: rateLimitHandler,
    skip: (req) => !req.user,
  }),

  createTask: rateLimit({
    ...rateLimitConfig.api.createTask,
    ...withStore('api:create-task'),
    keyGenerator: (req) => req.user?._id?.toString() || getClientIp(req),
    handler: rateLimitHandler,
    skip: (req) => !req.user,
  }),

  uploadFile: rateLimit({
    ...rateLimitConfig.api.uploadFile,
    ...withStore('api:upload-file'),
    keyGenerator: (req) => req.user?._id?.toString() || getClientIp(req),
    handler: rateLimitHandler,
    skip: (req) => !req.user,
  }),

  postComment: rateLimit({
    ...rateLimitConfig.api.postComment,
    ...withStore('api:post-comment'),
    keyGenerator: (req) => req.user?._id?.toString() || getClientIp(req),
    handler: rateLimitHandler,
    skip: (req) => !req.user,
  }),

  updateProfile: rateLimit({
    ...rateLimitConfig.api.updateProfile,
    ...withStore('api:update-profile'),
    keyGenerator: (req) => req.user?._id?.toString() || getClientIp(req),
    handler: rateLimitHandler,
    skip: (req) => !req.user,
  }),
};

export const searchRateLimiter: RateLimitRequestHandler = rateLimit({
  ...rateLimitConfig.search,
  ...withStore('search'),
  keyGenerator: (req) => req.user?._id?.toString() || getClientIp(req),
  handler: rateLimitHandler,
});

interface EmailRateLimitResult {
  allowed: boolean;
  remaining?: number;
  resetAt?: Date;
  retryAfter?: number;
  message?: string;
}

export class EmailRateLimiter {
  private prefix = 'rate-limit:email';

  async checkUserLimit(userId: string): Promise<EmailRateLimitResult> {
    try {
      const now = Date.now();
      const hourKey = `${this.prefix}:user:${userId}:hour`;
      const dayKey = `${this.prefix}:user:${userId}:day`;

      const hourCount = await redisClient.get(hourKey);
      const dayCount = await redisClient.get(dayKey);

      const hourlyUsed = hourCount ? parseInt(hourCount, 10) : 0;
      const dailyUsed = dayCount ? parseInt(dayCount, 10) : 0;

      const hourlyLimit = rateLimitConfig.email.perUser.hourly.max;
      const dailyLimit = rateLimitConfig.email.perUser.daily.max;

      if (hourlyUsed >= hourlyLimit) {
        const ttl = await redisClient.ttl(hourKey);
        const retryAfter = ttl > 0 ? ttl : Math.ceil(rateLimitConfig.email.perUser.hourly.windowMs / 1000);
        return {
          allowed: false,
          remaining: 0,
          resetAt: new Date(now + retryAfter * 1000),
          retryAfter,
          message: 'Hourly email limit exceeded. Please try again later.',
        };
      }

      if (dailyUsed >= dailyLimit) {
        const ttl = await redisClient.ttl(dayKey);
        const retryAfter = ttl > 0 ? ttl : Math.ceil(rateLimitConfig.email.perUser.daily.windowMs / 1000);
        return {
          allowed: false,
          remaining: 0,
          resetAt: new Date(now + retryAfter * 1000),
          retryAfter,
          message: 'Daily email limit exceeded.',
        };
      }

      return {
        allowed: true,
        remaining: Math.min(hourlyLimit - hourlyUsed, dailyLimit - dailyUsed),
      };
    } catch (error) {
      logger.error('Email rate limit check failed:', error);
      return { allowed: true };
    }
  }

  async checkGlobalLimit(): Promise<EmailRateLimitResult> {
    try {
      const now = Date.now();
      const hourKey = `${this.prefix}:global:hour`;
      const dayKey = `${this.prefix}:global:day`;

      const hourCount = await redisClient.get(hourKey);
      const dayCount = await redisClient.get(dayKey);

      const hourlyUsed = hourCount ? parseInt(hourCount, 10) : 0;
      const dailyUsed = dayCount ? parseInt(dayCount, 10) : 0;

      const hourlyLimit = rateLimitConfig.email.global.hourly.max;
      const dailyLimit = rateLimitConfig.email.global.daily.max;

      if (hourlyUsed >= hourlyLimit) {
        const ttl = await redisClient.ttl(hourKey);
        const retryAfter = ttl > 0 ? ttl : Math.ceil(rateLimitConfig.email.global.hourly.windowMs / 1000);
        return {
          allowed: false,
          remaining: 0,
          resetAt: new Date(now + retryAfter * 1000),
          retryAfter,
          message: 'System email limit exceeded. Please try again later.',
        };
      }

      if (dailyUsed >= dailyLimit) {
        const ttl = await redisClient.ttl(dayKey);
        const retryAfter = ttl > 0 ? ttl : Math.ceil(rateLimitConfig.email.global.daily.windowMs / 1000);
        return {
          allowed: false,
          remaining: 0,
          resetAt: new Date(now + retryAfter * 1000),
          retryAfter,
          message: 'Daily system email limit exceeded.',
        };
      }

      return {
        allowed: true,
        remaining: Math.min(hourlyLimit - hourlyUsed, dailyLimit - dailyUsed),
      };
    } catch (error) {
      logger.error('Global email rate limit check failed:', error);
      return { allowed: true };
    }
  }

  async incrementCounters(userId: string): Promise<void> {
    try {
      const hourKey = `${this.prefix}:user:${userId}:hour`;
      const dayKey = `${this.prefix}:user:${userId}:day`;
      const globalHourKey = `${this.prefix}:global:hour`;
      const globalDayKey = `${this.prefix}:global:day`;

      const hourExists = await redisClient.exists(hourKey);
      if (hourExists) {
        await redisClient.incr(hourKey);
      } else {
        await redisClient.set(hourKey, 1, { PX: rateLimitConfig.email.perUser.hourly.windowMs });
      }

      const dayExists = await redisClient.exists(dayKey);
      if (dayExists) {
        await redisClient.incr(dayKey);
      } else {
        await redisClient.set(dayKey, 1, { PX: rateLimitConfig.email.perUser.daily.windowMs });
      }

      const globalHourExists = await redisClient.exists(globalHourKey);
      if (globalHourExists) {
        await redisClient.incr(globalHourKey);
      } else {
        await redisClient.set(globalHourKey, 1, { PX: rateLimitConfig.email.global.hourly.windowMs });
      }

      const globalDayExists = await redisClient.exists(globalDayKey);
      if (globalDayExists) {
        await redisClient.incr(globalDayKey);
      } else {
        await redisClient.set(globalDayKey, 1, { PX: rateLimitConfig.email.global.daily.windowMs });
      }
    } catch (error) {
      logger.error('Failed to increment email counters:', error);
    }
  }

  async checkEmailRateLimit(userId: string): Promise<EmailRateLimitResult> {
    const userLimit = await this.checkUserLimit(userId);
    if (!userLimit.allowed) {
      return userLimit;
    }

    const globalLimit = await this.checkGlobalLimit();
    if (!globalLimit.allowed) {
      return globalLimit;
    }

    return {
      allowed: true,
      remaining: Math.min(
        userLimit.remaining ?? Number.POSITIVE_INFINITY,
        globalLimit.remaining ?? Number.POSITIVE_INFINITY,
      ),
    };
  }
}

export const emailRateLimiter = new EmailRateLimiter();
