import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGODB_URI: z.string(),
  REDIS_URL: z.string(),
  REDIS_ENABLED: z.enum(['true', 'false']).default('true'),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  ACCESS_TOKEN_COOKIE: z.string().default('accessToken'),
  USER_CACHE_TTL_SECONDS: z.coerce.number().default(3600),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string().default('http://localhost:8080/api/v1/auth/oauth/google/callback'),
  GOOGLE_REFRESH_TOKEN: z.string(),
  GMAIL_FROM_NAME: z.string(),
  GMAIL_FROM_EMAIL: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_TOKEN: z.string(),
  DISCORD_REDIRECT_URI: z.string().default("http://localhost:8080/api/v1/auth/oauth/discord/callback"),
  FRONTEND_REDIRECT_URL: z.string().default("http://localhost:5173"),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_BUCKET_NAME: z.string(),
});

const env = envSchema.parse(process.env);
export default Object.freeze(env);