// src/features/ProjectPage/slice/projectProfileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectProfileApi } from "../api/projectProfileApi";

export const fetchProjectProfile = createAsyncThunk(
  "projectProfile/fetchProjectProfile",
  async () => {
    const response = await projectProfileApi.getProjectProfile();
    return response;
  }
);

const projectProfileSlice = createSlice({
  name: "projectProfile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProjectProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default projectProfileSlice.reducer;
