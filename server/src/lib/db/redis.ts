import { createClient } from 'redis';
import env from '@/config/env';
import { logger } from '@/utils/logger';

export const isRedisEnabled = env.REDIS_ENABLED === 'true';

export const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    keepAlive: true,
    reconnectStrategy: (retries) => {
      if (!isRedisEnabled) {
        return new Error('Redis disabled');
      }

      const delay = Math.min(retries * 50, 2000);
      logger.warn(`Redis reconnecting... attempt #${retries}`);
      return delay;
    },
  },
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

redisClient.on('ready', () => {
  logger.info('Redis Client Ready');
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis Client Reconnecting...');
});

redisClient.on('end', () => {
  logger.warn('Redis Connection Closed');
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err.message);
});

export const connectRedis = async (): Promise<void> => {
  try {
    if (!isRedisEnabled) {
      logger.info('⚙️ Redis connections disabled by configuration');
      return;
    }

    if (!redisClient.isOpen) {
      await redisClient.connect();
      logger.info('Redis connection established successfully');
    }
  } catch (error) {
    logger.error('❌ Error connecting to Redis:', error);
  }
};

if (isRedisEnabled) {
  setInterval(async () => {
    if (redisClient.isOpen) {
      try {
        await redisClient.ping();
      } catch (err: any) {
        logger.warn('Redis ping failed:', err.message);
      }
    }
  }, 60000);
}