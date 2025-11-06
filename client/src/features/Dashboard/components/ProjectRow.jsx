// Filename: components/ProjectRow.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// --- Helper object for status colors ---
const statusColors = {
  Active: "bg-[#B4DA00] text-black",
  Completed: "bg-[#4FA2FF] text-black",
  "On Hold": "bg-gray-500/10 text-gray-400",
  // Add any other statuses you have
};

export default function ProjectRow({ project }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/app/project/${project.id}`);
  };

  // Get the color class or a default if status is unknown
  const colorClasses = 
    statusColors[project.status] || "bg-gray-700/10 text-gray-300";

  return (
    <tr
      className="border-b border-[#2d2d2d] hover:bg-[#333333] transition cursor-pointer"
      onClick={handleClick}
    >
      {/* Project Name / Updated */}
      <td className="py-3 px-4">
        <div className="text-white font-medium">{project.name}</div>
        <div className="text-gray-500 text-sm">Updated {project.updated}</div>
      </td>
      {/* Teams */}
      <td className="py-3 px-4 text-gray-300">{project.team}</td>
      {/* Creator */}
      <td className="py-3 px-4 text-gray-300">{project.creator}</td>
      {/* Lead */}
      <td className="py-3 px-4 text-gray-300">{project.lead}</td>
      {/* Due Date */}
      <td className="py-3 px-4 text-gray-300">{project.due}</td>
      
      {/* STATUS CELL */}
      <td className="py-3 px-4">
        <span
          className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${colorClasses}`}
        >
          {project.status}
        </span>
      </td>
    </tr>
  );
}