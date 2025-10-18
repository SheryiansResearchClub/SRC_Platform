import type { Request, UserDocument, SetOptions } from '@/types';
import { redisClient, isRedisEnabled, connectRedis } from '@/lib/db/redis';
import { logger } from '@/utils/logger';
import { User } from '@/models/user.model';
import env from '@/config/env';

export const getTokenFromRequest = (req: Request): string | undefined => {
  const token = (req.cookies?.[env.ACCESS_TOKEN_COOKIE] || req.headers.authorization?.replace('Bearer ', '').trim()) as string | undefined;
  return typeof token === 'string' && token.length > 0 ? token : undefined;
};

export const getBlacklistKey = (token: string): string => `auth:blacklist:${token}`;
export const getUserCacheKey = (userId: string): string => `auth:user:${userId}`;

export const ensureRedisConnection = async (): Promise<void> => {
  if (!isRedisEnabled) return;

  try {
    if (!redisClient.isOpen) {
      await connectRedis();
    }
  } catch (error) {
    logger.error('Failed to establish Redis connection', { error });
  }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  if (!isRedisEnabled) return false;

  try {
    await ensureRedisConnection();
    const result = await redisClient.get(getBlacklistKey(token));
    return Boolean(result);
  } catch (error) {
    logger.error('Failed to check token blacklist', { error });
    return false;
  }
};

export const getCachedUser = async (userId: string): Promise<UserDocument | null> => {
  if (!isRedisEnabled) return null;

  try {
    await ensureRedisConnection();
    const cached = await redisClient.get(getUserCacheKey(userId));
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    return User.hydrate(parsed) as UserDocument;
  } catch (error) {
    logger.warn('Failed to hydrate cached user', { error });
    return null;
  }
};

export const cacheUser = async (user: UserDocument, ttlSeconds?: number): Promise<void> => {
  if (!isRedisEnabled) return;

  try {
    await ensureRedisConnection();
    const cacheValue = JSON.stringify(
      user.toObject({ depopulate: true, versionKey: false, virtuals: false })
    );
    const ttl = ttlSeconds ?? env.USER_CACHE_TTL_SECONDS;
    const expiration: SetOptions['expiration'] = ttl > 0 ? { type: 'EX', value: ttl } : undefined;
    const options: SetOptions | undefined = expiration ? { expiration } : undefined;

    await redisClient.set(
      getUserCacheKey(user._id.toString()),
      cacheValue,
      options
    );
  } catch (error) {
    logger.warn('Failed to cache user document', { error });
  }
};