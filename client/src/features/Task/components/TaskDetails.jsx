import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import {
  AiOutlineCheckCircle,
  AiOutlinePaperClip,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { MdOutlineLabelImportant, MdOutlineFlag } from "react-icons/md";
import ThemeContext from "@/context/ThemeContext";

const TaskDetails = () => {
  const navigate = useNavigate();
  const { dark } = useContext(ThemeContext);
  const { state } = useLocation();

  const task = state?.task || {
    id: 1,
    title: "Fix SRC Website Responsiveness",
    description:
      "Improve animations, mobile layout, and align typography with the brand guidelines. Ensure the design remains pixel-perfect across devices.",
    status: "Working",
    priority: "High",
    deadline: "Nov 5, 2025",
    created: "Oct 29, 2025",
    assignedBy: "Aayush Chouhan",
    members: [
      { name: "Aayush Chouhan", role: "Frontend Dev", active: true },
      { name: "Neha Sharma", role: "UI Designer", active: true },
    ],
    subtasks: [
      { name: "Fix navbar alignment", done: true },
      { name: "Improve hero animation", done: false },
      { name: "Adjust footer layout", done: false },
    ],
    attachments: ["hero-design.fig", "preview.mp4", "layout-update.png"],
    comments: [
      { user: "Neha", text: "Fixed hero animation timing.", time: "2h ago" },
      { user: "Aayush", text: "Looks smoother now.", time: "1h ago" },
    ],
    activity: [
      { time: "10:00 AM", action: "Status changed to Working" },
      { time: "10:45 AM", action: "Uploaded hero-design.fig" },
      { time: "11:15 AM", action: "Commented on animation speed" },
    ],
  };

  const card = dark
    ? "bg-[#1e1e1e] border-[#2d2d2d]"
    : "bg-gray-100 border-gray-300";

  return (
    <div
      className={`p-4 sm:p-6 lg:p-8 font-sans -mt-10 ${
        dark ? "bg-[#0B0D0E] text-white" : "bg-white text-black"
      }`}
    >
      {/* Back Button */}
      <IoReturnUpBack
        onClick={() => navigate(-1)}
        className={`mb-4 text-2xl cursor-pointer ${
          dark ? "hover:text-gray-200" : "hover:text-gray-600"
        }`}
      />

      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold break-words">
          {task.title}
        </h1>
        <p className={`${dark ? "text-[#a1a1a1]" : "text-[#2c2c2c]"}`}>
          Created on {task.created}
        </p>
      </div>

      {/* Task Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* Status */}
        <div className={`flex flex-col justify-center p-5 rounded-2xl border ${card}`}>
          <div className="flex items-center gap-2 mb-1">
            <MdOutlineLabelImportant className="text-lg text-yellow-400" />
            <p className="text-base sm:text-lg font-semibold text-gray-300">Status</p>
          </div>
          <span
            className={`text-sm sm:text-base w-fit px-3 py-1.5 font-medium rounded-lg ${
              task.status === "Completed"
                ? "bg-green-900 text-green-400"
                : task.status === "Working"
                ? "bg-yellow-900 text-yellow-400"
                : "bg-red-900 text-red-400"
            }`}
          >
            {task.status}
          </span>
        </div>

        {/* Priority */}
        <div className={`flex flex-col justify-center p-5 rounded-2xl border ${card}`}>
          <div className="flex items-center gap-2 mb-1">
            <MdOutlineFlag className="text-lg text-blue-400" />
            <p className="text-base sm:text-lg font-semibold text-gray-300">Priority</p>
          </div>
          <span
            className={`w-fit px-3 py-1.5 text-sm sm:text-base font-medium rounded-lg ${
              task.priority === "Low"
                ? "bg-yellow-900 text-yellow-400"
                : task.priority === "Medium"
                ? "bg-blue-900 text-blue-400"
                : task.priority === "High"
                ? "bg-red-900 text-red-400"
                : "bg-purple-900 text-purple-400"
            }`}
          >
            {task.priority}
          </span>
        </div>

        {/* Deadline */}
        <div className={`flex flex-col justify-center p-5 rounded-2xl border ${card}`}>
          <div className="flex items-center gap-2 mb-1">
            <AiOutlineClockCircle className="text-lg text-red-400" />
            <p className="text-base sm:text-lg font-semibold text-gray-300">Deadline</p>
          </div>
          <p className="flex items-center gap-2 text-sm sm:text-base break-words">
            {task.deadline}
          </p>
        </div>

        {/* Assigned By */}
        <div className={`flex flex-col justify-center p-5 rounded-2xl border ${card}`}>
          <div className="flex items-center gap-2 mb-1">
            <BsPerson className="text-lg text-green-400" />
            <p className="text-base sm:text-lg font-semibold text-gray-300">Assigned By</p>
          </div>
          <p className="text-sm sm:text-base break-words">{task.assignedBy}</p>
        </div>
      </div>

      {/* Description */}
      <div className={`rounded-xl border ${card} p-5 mb-6`}>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-400 leading-relaxed text-sm sm:text-base break-words">
          {task.description}
        </p>
      </div>

      {/* Members */}
      <div className={`rounded-xl border ${card} p-5 mb-6`}>
        <h2 className="text-lg sm:text-xl font-semibold mb-3">Assigned Members</h2>
        <div className="space-y-3">
          {task.members.map((m, i) => (
            <div key={i} className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-600/20 rounded-full flex items-center justify-center">
                  <BsPerson className="text-yellow-400" />
                </div>
                <span className="text-sm sm:text-base">{m.name}</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-400">{m.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtasks */}
      <div className={`rounded-xl border ${card} p-5 mb-6`}>
        <h2 className="text-lg sm:text-xl font-semibold mb-3">Subtasks</h2>
        <div className="space-y-3">
          {task.subtasks.map((sub, i) => (
            <div key={i} className="flex justify-between items-center flex-wrap gap-2 border-b border-gray-700 pb-2">
              <span
                className={`text-sm sm:text-base break-words ${
                  sub.done ? "line-through text-gray-500" : ""
                }`}
              >
                {sub.name}
              </span>
              <AiOutlineCheckCircle
                className={sub.done ? "text-green-400" : "text-gray-500"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Attachments */}
      <div className={`rounded-xl border ${card} p-5 mb-6`}>
        <h2 className="text-lg sm:text-xl font-semibold mb-3">Attachments</h2>
        <div className="space-y-2">
          {task.attachments.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-gray-400 text-sm sm:text-base break-all"
            >
              <AiOutlinePaperClip /> <span>{file}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className={`rounded-xl border ${card} p-5 mb-6`}>
        <h2 className="text-lg sm:text-xl font-semibold mb-3">Comments</h2>
        <div className="space-y-3">
          {task.comments.map((c, i) => (
            <div key={i} className="border-b border-gray-700 pb-2">
              <p className="font-medium text-sm sm:text-base">{c.user}</p>
              <p className="text-gray-400 text-sm break-words">{c.text}</p>
              <p className="text-xs text-gray-500 mt-1">{c.time}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <textarea
            placeholder="Add a comment..."
            rows={3}
            className={`w-full rounded-lg p-3 text-sm sm:text-base outline-none resize-none ${
              dark
                ? "bg-[#0f0f0f] text-gray-200 placeholder-gray-500"
                : "bg-white text-gray-800 placeholder-gray-400"
            }`}
          />
          <button className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white">
            Post Comment
          </button>
        </div>
      </div>

      {/* Activity Log */}
      <div className={`rounded-xl border ${card} p-5`}>
        <h2 className="text-lg sm:text-xl font-semibold mb-3">Activity Log</h2>
        <div className="space-y-2 text-sm sm:text-base">
          {task.activity.map((a, i) => (
            <div
              key={i}
              className="flex justify-between flex-wrap gap-1 border-b border-gray-700 pb-1 text-gray-400"
            >
              <span>{a.action}</span>
              <span>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
