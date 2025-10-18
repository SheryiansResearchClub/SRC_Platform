// src/config/store.js

import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/Auth/slice/authSlice';

export const store = configureStore({
  reducer: {
   
    auth: authReducer,
  },
});