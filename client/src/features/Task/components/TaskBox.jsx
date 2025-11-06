import React, { useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";

const TaskBox = ({ dark, closeBox, newTask, setNewTask, onCreate, members }) => {
  const [subtaskInput, setSubtaskInput] = useState("");
  const [attachmentInput, setAttachmentInput] = useState("");

  const handleAddTask = () => {
    if (
      !newTask.title ||
      !newTask.creator ||
      !newTask.assigned ||
      !newTask.due ||
      !newTask.description
    )
      return alert("Please fill all required fields before adding a task.");

    const created = new Date().toLocaleDateString();

    const task = {
      ...newTask,
      created,
      status: "Not Started",
      comments: [],
      activity: [
        { time: new Date().toLocaleTimeString(), action: "Task created" },
      ],
    };

    onCreate(task);

    setNewTask({
      title: "",
      description: "",
      creator: "",
      assigned: "",
      priority: "Medium",
      due: "",
      members: [],
      subtasks: [],
      attachments: [],
    });

    closeBox();
  };

  const handleAddSubtask = () => {
    if (subtaskInput.trim() === "") return;
    setNewTask({
      ...newTask,
      subtasks: [...(newTask.subtasks || []), { name: subtaskInput, done: false }],
    });
    setSubtaskInput("");
  };

  const handleAddAttachment = () => {
    if (attachmentInput.trim() === "") return;
    setNewTask({
      ...newTask,
      attachments: [...(newTask.attachments || []), attachmentInput],
    });
    setAttachmentInput("");
  };

  const handleAddMember = (memberName) => {
    if (!memberName || newTask.members?.some((m) => m.name === memberName)) return;
    setNewTask({
      ...newTask,
      members: [
        ...(newTask.members || []),
        { name: memberName, role: "Contributor", active: true },
      ],
    });
  };

  const inputStyle = `p-2 rounded-md border w-full outline-none ${
    dark
      ? "bg-[#1a1a1a] border-[#2d2d2d] text-white"
      : "bg-white border-gray-300 text-black"
  }`;

  return (
    <div
      className={`fixed top-[10%] left-1/2 -translate-x-1/2 w-[95%] md:w-[65%] lg:w-[45%] 
      rounded-2xl p-6 border z-50 shadow-2xl overflow-y-auto max-h-[85vh]
      ${dark ? "bg-[#232323] border-[#373737]" : "bg-[#f4f4f4] border-[#cfcfcf]"}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Create a New Task</h2>
        <IoReturnUpBack
          onClick={closeBox}
          className="text-2xl cursor-pointer hover:scale-105 transition-transform"
        />
      </div>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className={inputStyle}
        />

        <textarea
          placeholder="Task Description"
          rows={3}
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className={`${inputStyle} resize-none`}
        />

        <input
          type="text"
          placeholder="Creator"
          value={newTask.creator}
          onChange={(e) => setNewTask({ ...newTask, creator: e.target.value })}
          className={inputStyle}
        />

        {/* Assign */}
        <select
          value={newTask.assigned}
          onChange={(e) => {
            setNewTask({ ...newTask, assigned: e.target.value });
            handleAddMember(e.target.value);
          }}
          className={inputStyle}
        >
          <option value="">Assign to...</option>
          {members.slice(1).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        {/* Priority */}
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          className={inputStyle}
        >
          {["Urgent", "High", "Medium", "Low"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <input
          type="date"
          value={newTask.due}
          onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
          className={inputStyle}
        />

        {/* Members */}
        {newTask.members?.length > 0 && (
          <div className="mt-2">
            <h3 className="text-sm font-semibold mb-1">Assigned Members:</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              {newTask.members.map((m, i) => (
                <li key={i}>{m.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Subtasks */}
        <div>
          <h3 className="text-sm font-semibold mb-1">Subtasks</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add subtask"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              className={inputStyle}
            />
            <button
              onClick={handleAddSubtask}
              className={`px-3 py-2 rounded-md ${
                dark
                  ? "bg-blue-700 hover:bg-blue-600 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              +
            </button>
          </div>
          <ul className="text-sm text-gray-400 space-y-1">
            {newTask.subtasks?.map((s, i) => (
              <li key={i}>• {s.name}</li>
            ))}
          </ul>
        </div>

        {/* Attachments */}
        <div>
          <h3 className="text-sm font-semibold mb-1">Attachments</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="e.g. hero-design.fig"
              value={attachmentInput}
              onChange={(e) => setAttachmentInput(e.target.value)}
              className={inputStyle}
            />
            <button
              onClick={handleAddAttachment}
              className={`px-3 py-2 rounded-md ${
                dark
                  ? "bg-green-700 hover:bg-green-600 text-white"
                  : "bg-green-600 hover:bg-green-500 text-white"
              }`}
            >
              +
            </button>
          </div>
          <ul className="text-sm text-gray-400 space-y-1">
            {newTask.attachments?.map((a, i) => (
              <li key={i}>📎 {a}</li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={closeBox}
            className={`px-4 py-2 rounded-md font-semibold transition-all
              ${dark ? "bg-[#2d2d2d] hover:bg-[#3a3a3a] text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleAddTask}
            className={`px-4 py-2 rounded-md font-semibold transition-all
              ${dark ? "bg-blue-700 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskBox;
