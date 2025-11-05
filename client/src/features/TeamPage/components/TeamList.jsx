import React from "react";

export default function TeamList({ teams }) {
  return (
    <div className="bg-[#111315] rounded-lg shadow-xl w-full">
      {teams.map((team) => (
        <div
          key={team.id}
          className="flex items-center gap-4 p-5 hover:bg-[#1a1d21] cursor-pointer transition border-b border-[#2b2c2e]"
        >
          <div
            className={`w-20 h-20 rounded-lg flex items-center justify-center ${team.color}`}
          >
            <i className={`${team.icon} text-xl`}></i>
          </div>
          <div>
            <div className="text-lg font-medium">{team.name}</div>
            <div className="text-sm text-gray-400">{team.members}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
