import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  message: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      const { user = null, message = null } = action.payload ?? {};
      state.user = user;
      state.isAuthenticated = Boolean(user);
      state.message = message;
      state.error = null;
    },
    setAuthError: (state, action) => {
      state.error = action.payload ?? "";
    },
    setAuthMessage: (state, action) => {
      state.message = action.payload ?? null;
    },
    clearAuthFeedback: (state) => {
      state.message = null;
      state.error = null;
    },
    logout: () => ({ ...initialState }),
  },
});

export const { setAuthState, setAuthError, setAuthMessage, clearAuthFeedback, logout } = authSlice.actions;
export default authSlice.reducer;