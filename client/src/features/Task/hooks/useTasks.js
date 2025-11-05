// src/features/tasks/useTasks.js
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchTasks, addTask, updateTaskStatus, deleteTask } from "../slices/tasksSlice";

export const useTasks = () => {
  const dispatch = useDispatch();
  const { list: tasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const createTask = (task) => dispatch(addTask(task));
  const changeStatus = (task) => dispatch(updateTaskStatus(task));
  const removeTask = (title) => dispatch(deleteTask(title));

  return { tasks, status, error, createTask, changeStatus, removeTask };
};
