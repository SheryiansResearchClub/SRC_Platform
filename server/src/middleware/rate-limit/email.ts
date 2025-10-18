import type { EmailRateLimitResult } from '@/types';
import { rateLimitConfig } from '@/config/rate-limit.config';
import { redisClient } from '@/lib/db/redis';
import { logger } from '@/utils/logger';

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