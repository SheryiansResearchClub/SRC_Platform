import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function RecentActivitiesCard() {
  const [view, setView] = useState("activities");

  const activities = [
    { id: 1, text: "Team created successfully", user: "System" },
    { id: 2, text: "Riya added Neha as Sub-Lead", user: "Riya Infinity" },
  ];

  const events = [
    { id: 1, name: "Hackathon 2025", date: "Nov 15, 2025" },
    { id: 2, name: "Team Meetup", date: "Nov 20, 2025" },
  ];

  const renderContent = () => {
    if (view === "events") {
      return events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="flex items-center space-x-3 text-gray-300">
            <FaUserCircle className="w-6 h-6 text-gray-500" />
            <span className="text-base sm:text-lg">
              {event.name} — <span className="text-gray-400">{event.date}</span>
            </span>
          </div>
        ))
      ) : (
        <div className="flex items-center space-x-3 text-gray-400">
          <FaUserCircle className="w-6 h-6 text-gray-600" />
          <span className="text-base sm:text-lg">No events to show.</span>
        </div>
      );
    }

    return activities.length > 0 ? (
      activities.map((a) => (
        <div key={a.id} className="flex items-center space-x-3 text-gray-300">
          <FaUserCircle className="w-6 h-6 text-gray-500" />
          <span className="text-base sm:text-lg">
            {a.text} <span className="text-gray-400">— {a.user}</span>
          </span>
        </div>
      ))
    ) : (
      <div className="flex items-center space-x-3 text-gray-400">
        <FaUserCircle className="w-6 h-6 text-gray-600" />
        <span className="text-base sm:text-lg">No recent activities to show.</span>
      </div>
    );
  };

  return (
    <div className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-xl font-semibold">
          {view === "events" ? "Events" : "Recent Activities"}
        </h2>
        <span
          onClick={() => setView(view === "events" ? "activities" : "events")}
          className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors"
        >
          {view === "events" ? "Activities" : "Events"}
        </span>
      </div>

      <div className="space-y-4">{renderContent()}</div>
    </div>
  );
}
