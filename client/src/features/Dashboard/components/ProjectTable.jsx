// Filename: components/ProjectTable.jsx
import React from "react";
import ProjectRow from "./ProjectRow";

export default function ProjectTable({ projects }) {
  return (
    <div className="mt-6 bg-[#111315] rounded-xl p-5">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-800">
            <th className="py-3 px-4">PROJECT NAME</th>
            <th className="py-3 px-4">TEAMS</th>
            <th className="py-3 px-4">CREATOR</th>
            <th className="py-3 px-4">LEAD</th>
            <th className="py-3 px-4">DUE DATE</th>
            <th className="py-3 px-4">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <ProjectRow key={p.id || i} project={p} />
          ))}
        </tbody>
      </table>
    </div>
  );
}