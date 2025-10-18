// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, signup, forgotPassword, resetPassword, oauthLogin } from "../api/authApi";

// Thunks

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await login({ email, password, oauthProvider: "email" });
      localStorage.setItem("accessToken", res.data.data.accessToken);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await signup({ name, email, password, oauthProvider: "email" });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const forgotUserPassword = createAsyncThunk(
  "auth/forgotUserPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await forgotPassword({ email });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "auth/resetUserPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await resetPassword({ token, newPassword });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// OAuth login thunk
export const oauthLoginUser = createAsyncThunk(
  "auth/oauthLoginUser",
  async ({ provider }, { rejectWithValue }) => {
    try {
      // for now, mock backend response
      const res = await oauthLogin({ provider }); // API stub can just return a fake user
      localStorage.setItem("accessToken", res.data.data.accessToken);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("accessToken") || null,
    loading: false,
    message: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("accessToken");
    },
    clearAuthFeedback: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; state.message = null; };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };

    // Login
    builder.addCase(loginUser.pending, handlePending);
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.message = "Login successful";
    });
    builder.addCase(loginUser.rejected, handleRejected);

    // Signup
    builder.addCase(signupUser.pending, handlePending);
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.message = "Signup successful";
    });
    builder.addCase(signupUser.rejected, handleRejected);

    // Forgot Password
    builder.addCase(forgotUserPassword.pending, handlePending);
    builder.addCase(forgotUserPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload;
    });
    builder.addCase(forgotUserPassword.rejected, handleRejected);

    // Reset Password
    builder.addCase(resetUserPassword.pending, handlePending);
    builder.addCase(resetUserPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload;
    });
    builder.addCase(resetUserPassword.rejected, handleRejected);

    // OAuth login
    builder.addCase(oauthLoginUser.pending, handlePending);
    builder.addCase(oauthLoginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.message = "OAuth login successful";
    });
    builder.addCase(oauthLoginUser.rejected, handleRejected);
  },
});

export const { logout, clearAuthFeedback } = authSlice.actions;
export default authSlice.reducer;
