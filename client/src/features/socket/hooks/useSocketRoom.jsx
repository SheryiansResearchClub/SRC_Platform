import { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  joinRoom as joinRoomAction,
  leaveRoom as leaveRoomAction,
  emitSocketEvent,
} from '@/features/socket/slices/socketSlice';

/**
 * Hook for managing room-specific operations
 * @param {string} roomId - Room ID to join
 * @param {Object} options - Configuration options
 */
export const useSocketRoom = (roomId, options = {}) => {
  const {
    autoJoin = true,
    autoLeave = true,
  } = options;

  const dispatch = useDispatch();
  const { connected, currentRoom } = useSelector((state) => state.socket);
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!autoJoin || !connected || !roomId) return;

    if (currentRoom !== roomId && !hasJoinedRef.current) {
      dispatch(joinRoomAction(roomId));
      hasJoinedRef.current = true;
    }

    return () => {
      if (autoLeave && hasJoinedRef.current && currentRoom === roomId) {
        dispatch(leaveRoomAction());
        hasJoinedRef.current = false;
      }
    };
  }, [roomId, connected, currentRoom, autoJoin, autoLeave, dispatch]);

  const sendToRoom = useCallback((message, callback) => {
    if (!connected || currentRoom !== roomId) {
      console.warn('Cannot send to room: Not connected or not in room');
      return false;
    }

    try {
      emitSocketEvent('room:message', { roomId, message }, callback);
      return true;
    } catch (error) {
      console.error('Error sending to room:', error);
      return false;
    }
  }, [connected, currentRoom, roomId]);

  return {
    isInRoom: currentRoom === roomId,
    sendToRoom,
  };
};