// src/features/Dashboard/slice/dashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { projectsData } from "../api/dashboardMockApi";


const initialState = {
  dashboard: { resources: [], events: [] },
  ongoingProjects: [],
  tasksDueToday: [],
  isLoading: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading: (state, action) => { state.isLoading = action.payload; },
    setDashboardData: (state, action) => {
      state.dashboard = action.payload.dashboard;
      state.ongoingProjects = action.payload.projects;
      state.tasksDueToday = action.payload.tasks;
    },
  },
});

export const { setLoading, setDashboardData } = dashboardSlice.actions;

export const loadDashboardData = () => (dispatch) => {
  dispatch(setLoading(true));
  setTimeout(() => {
    dispatch(setDashboardData({
      dashboard: dashboardMockApi.getDashboard(),
      projects: dashboardMockApi.getOngoingProjects(),
      tasks: dashboardMockApi.getTasksDueToday(),
    }));
    dispatch(setLoading(false));
  }, 500);
};

export default dashboardSlice.reducer;
