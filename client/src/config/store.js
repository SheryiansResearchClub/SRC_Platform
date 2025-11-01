import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slices/authSlice';
import socketReducer from '@/features/socket/slices/socketSlice';
import dashboardReducer from '@/features/Dashboard/slice/dashboardSlice';
import projectProfileReducer from '@/features/ProjectPage/slice/projectProfileSlice';
import projectSlice from '@/features/AllProjects/slice/projectSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
    dashboard: dashboardReducer,
    projectProfile: projectProfileReducer, 
    projects: projectSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/connect'],
        ignoredActionPaths: ['payload.socket'],
        ignoredPaths: ['socket.socket'],
      },
    }),
});
