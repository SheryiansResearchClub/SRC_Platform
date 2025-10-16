import env from '@/config/env';

export const emailConfig = {
  service: 'gmail',
  auth: {
    type: 'OAuth2' as const,
    user: env.GMAIL_FROM_EMAIL,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    refreshToken: env.GOOGLE_REFRESH_TOKEN,
  },
  from: {
    name: env.GMAIL_FROM_NAME || 'SRC Platform',
    email: env.GMAIL_FROM_EMAIL,
  },

  templates: {
    baseUrl: 'www.sheryians.com',
  },
  retry: {
    maxAttempts: 3,
    delay: 1000,
  },
  rateLimit: {
    maxPerHour: 500,
    maxPerDay: 2000,
  },
};