import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "./Button";

export default function AssignTaskButton({ currentUser, project, onAssign }) {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState({
    title: "",
    assignee: "",
    deadline: "",
  });

  const canAssign =
    currentUser?.role?.toLowerCase() === "admin" ||
    currentUser?.role?.toLowerCase() === "leader";

  if (!canAssign) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title || !task.assignee) return;
    onAssign(task);
    setTask({ title: "", assignee: "", deadline: "" });
    setOpen(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Assign Task
      </Button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Assign New Task
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task Title
                </label>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) =>
                    setTask((t) => ({ ...t, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-md bg-white dark:bg-[#222] text-gray-800 dark:text-gray-200"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assign To
                </label>
                <select
                  value={task.assignee}
                  onChange={(e) =>
                    setTask((t) => ({ ...t, assignee: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-md bg-white dark:bg-[#222] text-gray-800 dark:text-gray-200"
                >
                  <option value="">Select a team member</option>
                  {project.teamMembers.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Deadline
                </label>
                <input
                  type="date"
                  value={task.deadline}
                  onChange={(e) =>
                    setTask((t) => ({ ...t, deadline: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-md bg-white dark:bg-[#222] text-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
