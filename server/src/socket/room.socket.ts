import type { Server, Socket } from '@/types';
import { logger } from '@/utils/logger';

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on('room:join', (roomId: string) => {
    socket.join(roomId);
    logger.info(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('room:leave', (roomId: string) => {
    socket.leave(roomId);
    logger.info(`Socket ${socket.id} left room ${roomId}`);
  });

  socket.on('disconnect', (reason) => {
    logger.info(`❌ Socket ${socket.id} disconnected: ${reason}`);
  });
};