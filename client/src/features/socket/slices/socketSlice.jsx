import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { refreshToken } from '@/features/auth/api/authApi';
import { store } from '@/config/store';
import { logout } from '@/features/auth/slices/authSlice';

class SocketManager {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  getInstance() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  async connect(url, dispatch) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    const token = Cookies.get('accessToken');
    if (!token) {
      throw new Error('No access token available');
    }

    this.socket = io(url, {
      autoConnect: true,
      transports: ['websocket'],
      withCredentials: true,
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers(dispatch);
    return this.socket;
  }

  setupEventHandlers(dispatch) {
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
      this.reconnectAttempts = 0;
      dispatch(setConnected(true));
      dispatch(setError(null));
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket:', reason);
      dispatch(setConnected(false));
      dispatch(setCurrentRoom(null));

      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', async (error) => {
      console.error('Connection error:', error.message);
      this.reconnectAttempts++;

      if (error.message.includes('Token has expired') ||
        error.message.includes('Authentication token')) {
        try {
          await refreshToken();
          const newToken = Cookies.get('accessToken');

          if (newToken) {
            this.socket.auth = { token: newToken };
            this.socket.connect();
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          dispatch(setError('Authentication failed. Please login again.'));
          store.dispatch(logout());
        }
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        dispatch(setError('Unable to connect to server. Please try again later'));
      } else {
        dispatch(setError(error.message));
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      dispatch(setError(error.message || 'An unknown error occurred'));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  emit(event, data, callback) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }
  }

  on(event, handler) {
    if (this.socket) {
      this.socket.on(event, handler);
    }
  }

  off(event, handler) {
    if (this.socket) {
      this.socket.off(event, handler);
    }
  }
}

const socketManager = new SocketManager();

const initialState = {
  connected: false,
  currentRoom: null,
  error: null,
  isConnecting: false,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
      state.isConnecting = false;
      if (!action.payload) {
        state.currentRoom = null;
      }
    },
    setConnecting: (state, action) => {
      state.isConnecting = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isConnecting = false;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setConnected,
  setConnecting,
  setError,
  setCurrentRoom,
  clearError
} = socketSlice.actions;

export const connectSocket = (url) => async (dispatch, getState) => {
  const { connected, isConnecting } = getState().socket;

  if (connected || isConnecting) {
    console.log('Socket already connected or connecting');
    return;
  }

  try {
    dispatch(setConnecting(true));
    await socketManager.connect(url, dispatch);
  } catch (error) {
    console.error('Failed to connect socket:', error);
    dispatch(setError(error.message));
    dispatch(setConnecting(false));
  }
};

export const disconnectSocket = () => (dispatch) => {
  try {
    socketManager.disconnect();
    dispatch(setConnected(false));
    dispatch(setCurrentRoom(null));
    dispatch(setError(null));
  } catch (error) {
    console.error('Error disconnecting socket:', error);
  }
};

export const joinRoom = (roomId) => (dispatch, getState) => {
  const { currentRoom, connected } = getState().socket;

  if (!connected) {
    dispatch(setError('Cannot join room: Socket not connected'));
    return;
  }

  if (currentRoom === roomId) {
    console.log('Already in room:', roomId);
    return;
  }

  try {
    if (currentRoom) {
      socketManager.emit('room:leave', { roomId: currentRoom });
    }
    socketManager.emit('room:join', { roomId }, (response) => {
      if (response?.success) {
        dispatch(setCurrentRoom(roomId));
        dispatch(clearError());
      } else {
        dispatch(setError(response?.error || 'Failed to join room'));
      }
    });
  } catch (error) {
    console.error('Error joining room:', error);
    dispatch(setError(error.message));
  }
};

export const leaveRoom = () => (dispatch, getState) => {
  const { currentRoom, connected } = getState().socket;

  if (!connected || !currentRoom) {
    return;
  }

  try {
    socketManager.emit('room:leave', { roomId: currentRoom }, (response) => {
      if (response?.success) {
        dispatch(setCurrentRoom(null));
      } else {
        dispatch(setError(response?.error || 'Failed to leave room'));
      }
    });
  } catch (error) {
    console.error('Error leaving room:', error);
    dispatch(setError(error.message));
  }
};

export const getSocketInstance = () => socketManager.getInstance();

export const emitSocketEvent = (event, data, callback) => {
  try {
    socketManager.emit(event, data, callback);
  } catch (error) {
    console.error('Error emitting socket event:', error);
    throw error;
  }
};

export const subscribeToSocketEvent = (event, handler) => {
  socketManager.on(event, handler);
};

export const unsubscribeFromSocketEvent = (event, handler) => {
  socketManager.off(event, handler);
};

export default socketSlice.reducer;