import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { appConfig } from '@/config/app.config';
import { errorHandler, notFoundHandler } from '@/middleware/error/error.middleware';
import routes from '@/routes';
import { logger } from '@/utils/logger';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors(appConfig.cors));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  app.use(compression());

  if (appConfig.env === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
  }

  app.get('/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(`/api/${appConfig.apiVersion}`, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};