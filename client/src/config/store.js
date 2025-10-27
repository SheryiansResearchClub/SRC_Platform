// src/config/store.js

import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/Auth/slice/authSlice';

import dashboardReducer from '@/features/Dashboard/slice/dashboardSlice';


export const store = configureStore({
  reducer: {
   
    auth: authReducer,
    dashboard: dashboardReducer,
  },
});