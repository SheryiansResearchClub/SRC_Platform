import React from "react";
import { Activity, CheckCircle2, Clock, ClipboardList } from "lucide-react";

export default function StatusBadge({ status }) {
  const statusConfig = {
    Ongoing: {
      color: "bg-lime-100 text-lime-800 dark:bg-lime-300 dark:text-lime-900",
      icon: <Activity className="w-3 h-3" />,
    },
    Completed: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-300 dark:text-blue-900",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    "On Hold": {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      icon: <Clock className="w-3 h-3" />,
    },
    Planning: {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      icon: <ClipboardList className="w-3 h-3" />,
    },
  };
  const config = statusConfig[status] || statusConfig.Planning;
  return (
    <span
      className={`inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-1 rounded-full ${config.color}`}
    >
      {config.icon}
      <span>{status}</span>
    </span>
  );
}
