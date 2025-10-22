import type { Server, Socket } from '@/types';
import { logger } from '@/utils/logger';

export const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on('chat:message', (data) => {
    if (typeof data === 'string') data = JSON.parse(data);
    const { roomId, message, sender } = data;
    logger.info(`Message from ${sender} in room ${roomId}: ${message}`);
    io.to(roomId).emit('chat:message', { sender, message });
  });
};
