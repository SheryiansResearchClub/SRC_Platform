import type { Application } from '@/types';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { appConfig } from '@/config/app.config';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from '@/middleware/error/errorHandler';
import { notFoundHandler } from '@/middleware/error/notFoundHandler';
import { globalRateLimiter } from '@/middleware/rate-limit';
import { swaggerSpec, swaggerUiOptions } from '@/config/swagger.config';
import routes from '@/routes';
import { logger } from '@/utils/logger';
import oauthClient from '@/integrations';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors(appConfig.cors));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  app.use(compression());

  oauthClient.configurePassport();
  app.use(oauthClient.passport.initialize());

  if (appConfig.env === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
  }

  app.get('/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(`/api/${appConfig.apiVersion}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  app.use(`/api/${appConfig.apiVersion}`, globalRateLimiter, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};