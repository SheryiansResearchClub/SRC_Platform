// src/features/tasks/tasksSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTasksAPI, addTaskAPI } from "../api/tasksApi";

// 🧾 Async thunks (simulate API)
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const data = await fetchTasksAPI();
  return data;
});

export const addTask = createAsyncThunk("tasks/addTask", async (task) => {
  const data = await addTaskAPI(task);
  return data;
});

// 📦 Slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {
    updateTaskStatus: (state, action) => {
      const { title, status } = action.payload;
      const task = state.list.find((t) => t.title === title);
      if (task) task.status = status;
    },
    deleteTask: (state, action) => {
      state.list = state.list.filter((t) => t.title !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const { updateTaskStatus, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
