import { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectSocket,
  disconnectSocket,
  getSocketInstance,
  joinRoom as joinRoomAction,
  leaveRoom as leaveRoomAction,
  subscribeToSocketEvent,
  unsubscribeFromSocketEvent,
  emitSocketEvent,
} from '@/features/socket/slices/socketSlice';

export const useWebSocket = (url, options = {}) => {
  const {
    autoConnect = true,
    reconnectOnMount = false,
    events = [],
  } = options;

  const dispatch = useDispatch();
  const isMountedRef = useRef(true);
  const eventHandlersRef = useRef(new Map());
  const [isReady, setIsReady] = useState(false);

  const { connected, currentRoom, error, isConnecting } = useSelector(
    (state) => state.socket
  );

  useEffect(() => {
    isMountedRef.current = true;

    const initSocket = async () => {
      if (autoConnect && !connected && !isConnecting) {
        try {
          await dispatch(connectSocket(url));
          if (isMountedRef.current) {
            setIsReady(true);
          }
        } catch (err) {
          console.error('Failed to connect socket:', err);
        }
      } else if (reconnectOnMount && !connected && !isConnecting) {
        try {
          await dispatch(connectSocket(url));
          if (isMountedRef.current) {
            setIsReady(true);
          }
        } catch (err) {
          console.error('Failed to reconnect socket:', err);
        }
      } else if (connected) {
        setIsReady(true);
      }
    };

    initSocket();

    return () => {
      isMountedRef.current = false;
      eventHandlersRef.current.forEach((handler, event) => {
        unsubscribeFromSocketEvent(event, handler);
      });
      eventHandlersRef.current.clear();
    };
  }, [url, dispatch, autoConnect, reconnectOnMount, connected, isConnecting]);

  useEffect(() => {
    if (!connected || events.length === 0) return;

    events.forEach((eventName) => {
      if (!eventHandlersRef.current.has(eventName)) {
        const handler = (data) => {
          console.log(`Event received: ${eventName}`, data);
        };
        subscribeToSocketEvent(eventName, handler);
        eventHandlersRef.current.set(eventName, handler);
      }
    });

    return () => {
      events.forEach((eventName) => {
        const handler = eventHandlersRef.current.get(eventName);
        if (handler) {
          unsubscribeFromSocketEvent(eventName, handler);
          eventHandlersRef.current.delete(eventName);
        }
      });
    };
  }, [connected, events]);

  const on = useCallback((event, handler) => {
    if (!event || typeof handler !== 'function') {
      console.error('Invalid event or handler');
      return () => { };
    }

    const wrappedHandler = (...args) => {
      if (isMountedRef.current) {
        handler(...args);
      }
    };

    subscribeToSocketEvent(event, wrappedHandler);
    eventHandlersRef.current.set(`${event}_${handler.name || 'anonymous'}`, wrappedHandler);

    return () => {
      unsubscribeFromSocketEvent(event, wrappedHandler);
      eventHandlersRef.current.delete(`${event}_${handler.name || 'anonymous'}`);
    };
  }, []);

  const off = useCallback((event, handler) => {
    if (!event) return;

    if (handler) {
      unsubscribeFromSocketEvent(event, handler);
      eventHandlersRef.current.delete(`${event}_${handler.name || 'anonymous'}`);
    } else {
      eventHandlersRef.current.forEach((wrappedHandler, key) => {
        if (key.startsWith(event)) {
          unsubscribeFromSocketEvent(event, wrappedHandler);
          eventHandlersRef.current.delete(key);
        }
      });
    }
  }, []);

  const emit = useCallback((event, data, callback) => {
    if (!connected) {
      console.warn('Cannot emit: Socket not connected');
      return false;
    }

    try {
      emitSocketEvent(event, data, callback);
      return true;
    } catch (error) {
      console.error('Error emitting event:', error);
      return false;
    }
  }, [connected]);

  const sendMessage = useCallback((message, callback) => {
    return emit('message', message, callback);
  }, [emit]);

  // Send a message to a specific room
  const sendToRoom = useCallback((roomId, message, callback) => {
    if (!roomId) {
      console.warn('Room ID is required');
      return false;
    }

    return emit('room:message', { roomId, message }, callback);
  }, [emit]);

  // Join a room
  const joinRoom = useCallback((roomId) => {
    if (!roomId) {
      console.warn('Room ID is required');
      return;
    }

    if (!connected) {
      console.warn('Cannot join room: Socket not connected');
      return;
    }

    if (currentRoom === roomId) {
      console.log('Already in room:', roomId);
      return;
    }

    dispatch(joinRoomAction(roomId));
  }, [currentRoom, connected, dispatch]);

  // Leave current room
  const leaveRoom = useCallback(() => {
    if (!currentRoom) {
      console.log('Not in any room');
      return;
    }

    if (!connected) {
      console.warn('Cannot leave room: Socket not connected');
      return;
    }

    dispatch(leaveRoomAction());
  }, [currentRoom, connected, dispatch]);

  // Manual connect
  const connect = useCallback(async () => {
    if (connected || isConnecting) {
      console.log('Already connected or connecting');
      return;
    }

    try {
      await dispatch(connectSocket(url));
      setIsReady(true);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, [connected, isConnecting, dispatch, url]);

  // Manual disconnect
  const disconnect = useCallback(() => {
    if (!connected) {
      console.log('Already disconnected');
      return;
    }

    dispatch(disconnectSocket());
    setIsReady(false);
  }, [connected, dispatch]);

  // Get socket instance (use sparingly)
  const getSocket = useCallback(() => {
    return getSocketInstance();
  }, []);

  return {
    // Connection state
    isConnected: connected,
    isConnecting,
    isReady,
    error,

    // Room state
    currentRoom,

    // Core methods
    emit,
    on,
    off,

    // Message methods
    sendMessage,
    sendToRoom,

    // Room methods
    joinRoom,
    leaveRoom,

    // Connection control
    connect,
    disconnect,

    // Advanced (use with caution)
    getSocket,
  };
};

export default useWebSocket;