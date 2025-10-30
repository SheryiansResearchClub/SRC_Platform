import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slices/authSlice';
import socketReducer from '@/features/socket/slices/socketSlice';
import dashboardReducer from '@/features/dashboard/slice/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
    dashboard: dashboardReducer,
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
