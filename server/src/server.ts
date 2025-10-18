import http from 'http';
import { Server } from 'socket.io';
import { createApp } from '@/app';
import { appConfig } from '@/config/app.config';
import { connectDB } from '@/lib/db/mongo';
import { connectRedis } from '@/lib/db/redis';
import { logger } from '@/utils/logger';

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await connectRedis();

    const app = createApp();

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: appConfig.cors,
    });

    io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });

    app.set('io', io);

    server.listen(appConfig.port, () => {
      logger.info(`Server running on port ${appConfig.port} in ${appConfig.env} mode`);
      logger.info(`API: http://localhost:${appConfig.port}/api/${appConfig.apiVersion}`);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();