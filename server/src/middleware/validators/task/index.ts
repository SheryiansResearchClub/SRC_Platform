import { createTaskValidation } from "./create-task.validator";
import { updateTaskValidation } from "./update-task.validator";
import { updateTaskStatusValidation } from "./task-status-priority.validator";
import { updateTaskPriorityValidation } from "./task-status-priority.validator";
import { assignTaskValidation } from "./task-status-priority.validator";
import { getTasksValidation } from "./task-status-priority.validator";
import { validateTaskId } from "./validate-taskId";

export {
  createTaskValidation,
  updateTaskValidation,
  updateTaskStatusValidation,
  updateTaskPriorityValidation,
  assignTaskValidation,
  getTasksValidation,
  validateTaskId
};
