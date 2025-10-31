import React from "react";

export default function ProjectRow({ project }) {
  return (
    <tr className="border-b border-gray-800 hover:bg-[#1a1d1f] transition">
      <td className="py-3 px-4">
        <div className="text-white font-medium">{project.name}</div>
        <div className="text-gray-500 text-sm">Updated {project.updated}</div>
      </td>
      <td className="py-3 px-4 text-gray-300">{project.team}</td>
      <td className="py-3 px-4 text-gray-300">{project.creator}</td>
      <td className="py-3 px-4 text-gray-300">{project.lead}</td>
      <td className="py-3 px-4">
        <div className="bg-gray-800 rounded-full h-2 relative">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <div className="text-gray-400 text-sm mt-1">{project.progress}%</div>
      </td>
    </tr>
  );
}
