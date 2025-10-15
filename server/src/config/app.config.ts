import env from '@config/env';
import type { SignOptions } from 'jsonwebtoken';

type JwtExpiration = NonNullable<SignOptions['expiresIn']>;

export const appConfig = {
  env: env.NODE_ENV,
  port: parseInt(env.PORT),
  apiVersion: 'v1',

  cors: {
    origin: env.CORS_ORIGIN.split(','),
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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
};