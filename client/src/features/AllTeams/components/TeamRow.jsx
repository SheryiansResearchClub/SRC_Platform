import React from "react";

export default function TeamRow({ team, isFirst, isLast, hasBorder }) {
  return (
    <div
      className={`flex items-center gap-4 p-5 hover:bg-[#333333] cursor-pointer transition
        ${hasBorder ? "border-b border-[#2d2d2d]" : ""}
        ${isFirst ? "rounded-t-lg" : ""}
        ${isLast ? "rounded-b-lg" : ""}
      `}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${team.color}`}
      >
        <i className={`${team.icon} text-xl text-white`}></i>
      </div>

      <div>
        <div className="text-lg font-medium text-white">
          {team.name || team.teamName}
        </div>
        <div className="text-sm text-gray-400">{team.members}</div>
      </div>
    </div>
  );
}
