import type { Request, Response, RedisClientType } from "@/types";
import RedisStore from 'rate-limit-redis';
import { redisClient, isRedisEnabled } from '@/lib/db/redis';
import { logger } from '@/utils/logger';

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown';
  return ip;
}

export function withStore(prefix: string) {
  const store = createRedisStore(prefix);
  return store ? { store } : {};
}

export function createRedisStore(prefix: string) {
  if (!isRedisEnabled) {
    return null;
  }
  const client = redisClient as RedisClientType;

  return new (RedisStore as any)({
    sendCommand: async (...args: string[]) => {
      if (!client.isOpen) {
        await client.connect();
      }

      const command = args.map((arg) => (typeof arg === 'string' ? arg : String(arg)));
      return client.sendCommand(command as unknown as never);
    },
    prefix: `rate-limit:${prefix}:`
  });
}

export const rateLimitHandler = (req: Request, res: Response) => {
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