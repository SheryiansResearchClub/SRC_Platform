import { createClient } from 'redis';
import env from '@/config/env';
import { logger } from '@/utils/logger';

export const isRedisEnabled = env.REDIS_ENABLED === 'true';

export const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: isRedisEnabled ? undefined : () => new Error('Redis disabled'),
  },
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

export const connectRedis = async (): Promise<void> => {
  try {
    if (!isRedisEnabled) {
      logger.info('Redis connections disabled by configuration');
      return;
    }
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    logger.error('Error connecting to Redis:', error);
  }
};