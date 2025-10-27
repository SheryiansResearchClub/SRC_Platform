import type { Server, Socket } from '@/types';
import { logger } from '@/utils/logger';
import { registerChatHandlers } from '@/socket/chat.socket';
import { registerRoomHandlers } from '@/socket/room.socket';
import { isAuthenticate } from '@/middleware/socket/isAuthenticate';

export const initSocketListeners = (io: Server) => {
  io.use(isAuthenticate);

  io.on('connection', (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    registerChatHandlers(io, socket);
    registerRoomHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });
};