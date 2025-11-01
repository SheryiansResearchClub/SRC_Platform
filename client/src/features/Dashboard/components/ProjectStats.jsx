import React from "react";
import { FaFolder, FaChartLine, FaCheckCircle, FaPauseCircle } from "react-icons/fa";

export default function ProjectStats({ stats }) {
  const cards = [
    { label: "Total Projects", value: stats.total, icon: <FaFolder /> },
    { label: "Active", value: stats.active, icon: <FaChartLine /> },
    { label: "Completed", value: stats.completed, icon: <FaCheckCircle /> },
    { label: "On Hold", value: stats.onHold, icon: <FaPauseCircle /> },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-[#111315] rounded-xl border border-[#181818] p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{card.label}</p>
            <h2 className="text-2xl font-semibold text-white mt-2">{card.value}</h2>
          </div>
          <span className="text-gray-300 text-xl">{card.icon}</span>
        </div>
      ))}
    </div>
  );
}
