import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slices/authSlice';
import socketReducer from '@/features/socket/slices/socketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/connect'],
        ignoredActionPaths: ['payload.socket'],
        ignoredPaths: ['socket.socket'],
      },
    })
});