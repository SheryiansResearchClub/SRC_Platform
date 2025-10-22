import type { CookieOptions, JwtExpiration } from '@/types';
import env from '@/config/env';

const isProduction = env.NODE_ENV === 'production';

export const appConfig = {
  env: env.NODE_ENV,
  port: parseInt(env.PORT),
  apiVersion: 'v1',

  cors: {
    origin: env.CORS_ORIGIN.split(','),
    credentials: true,
  },

  socketCors: {
    origin: env.CORS_ORIGIN.split(','),
    methods: ["GET", "POST"],
    credentials: true,
  },

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN as JwtExpiration,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN as JwtExpiration,
  },

  rateLimit: {
    windowMs: 60000,
    max: 100,
  },

  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  upload: {
    maxFileSize: 10 * 1024 * 1024,
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
    ],
  },

  cookie: {
    accessToken: {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 60 * 1000
    } satisfies CookieOptions,
    refreshToken: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 60 * 1000
    } satisfies CookieOptions
  }
};