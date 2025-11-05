import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTeams } from "../api/teamApi";

export const getTeams = createAsyncThunk("teams/getTeams", async () => {
  const data = await fetchTeams();
  return data;
});

const teamsSlice = createSlice({
  name: "teams",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default teamsSlice.reducer;
