import rateLimit from 'express-rate-limit';
import { rateLimitConfig } from '@/config/rate-limit.config';
import { getClientIp, rateLimitHandler, withStore } from '@/utils/rate-limit';

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

  createComment: rateLimit({
    ...rateLimitConfig.api.createComment,
    ...withStore('api:create-comment'),
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