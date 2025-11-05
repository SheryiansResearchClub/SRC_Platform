// features/TeamPage/slice/teamProfileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTeamById } from "../api/teamApi";

export const fetchTeamById = createAsyncThunk(
  "teamProfile/fetchTeamById",
  async (id) => {
    const team = await getTeamById(id);
    if (!team) throw new Error("Team not found");
    return team;
  }
);

const teamProfileSlice = createSlice({
  name: "teamProfile",
  initialState: {
    team: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default teamProfileSlice.reducer;
