import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProjectsApi } from "../api/projectMockApi";

// Define the initial state
const initialState = {
  data: [],
  loading: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

// Create the async thunk for fetching projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await fetchProjectsApi();
    return response;
  }
);

// Create the slice
const projectsSlice = createSlice({
  name: "projects",
  initialState,
  // No synchronous reducers needed for this example
  reducers: {},
  // Handle async actions with extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

// Selectors
export const selectAllProjects = (state) => state.projects.data;
export const selectProjectsLoading = (state) => state.projects.loading;
export const selectProjectsError = (state) => state.projects.error;

// Export the reducer
export default projectsSlice.reducer;
