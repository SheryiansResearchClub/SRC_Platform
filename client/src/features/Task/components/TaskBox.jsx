import React from "react";
import { IoReturnUpBack } from "react-icons/io5";

const TaskBox = ({ dark, closeBox, newTask, setNewTask, onCreate, members }) => {
  const handleAddTask = () => {
    if (!newTask.title || !newTask.creator || !newTask.assigned || !newTask.due)
      return alert("Please fill all fields before adding a task.");

    const created = new Date().toLocaleDateString();
    const task = { ...newTask, created, status: "Not Started" };

    // 🧩 Dispatch Redux addTask via onCreate()
    onCreate(task);

    // Reset form
    setNewTask({
      title: "",
      creator: "",
      assigned: "",
      priority: "Medium",
      due: "",
    });

    // Close modal
    closeBox();
  };

  return (
    <div
      className={`fixed top-[10%] left-1/2 -translate-x-1/2 w-[95%] md:w-[65%] lg:w-[40%] 
      rounded-2xl p-6 border z-50 shadow-2xl transition-all duration-300
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

      {/* Task Form */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className={`p-2 rounded-md border w-full outline-none 
            ${dark ? "bg-[#1a1a1a] border-[#2d2d2d] text-white" : "bg-white border-gray-300 text-black"}`}
        />

        <input
          type="text"
          placeholder="Creator"
          value={newTask.creator}
          onChange={(e) => setNewTask({ ...newTask, creator: e.target.value })}
          className={`p-2 rounded-md border w-full outline-none 
            ${dark ? "bg-[#1a1a1a] border-[#2d2d2d] text-white" : "bg-white border-gray-300 text-black"}`}
        />

        <select
          value={newTask.assigned}
          onChange={(e) => setNewTask({ ...newTask, assigned: e.target.value })}
          className={`p-2 rounded-md border w-full outline-none 
            ${dark ? "bg-[#1a1a1a] border-[#2d2d2d] text-white" : "bg-white border-gray-300 text-black"}`}
        >
          <option value="">Assign to...</option>
          {members.slice(1).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          className={`p-2 rounded-md border w-full outline-none 
            ${dark ? "bg-[#1a1a1a] border-[#2d2d2d] text-white" : "bg-white border-gray-300 text-black"}`}
        >
          {["Urgent", "High", "Medium", "Low"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <input
          type="date"
          value={newTask.due}
          onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
          className={`p-2 rounded-md border w-full outline-none 
            ${dark ? "bg-[#1a1a1a] border-[#2d2d2d] text-white" : "bg-white border-gray-300 text-black"}`}
        />

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
