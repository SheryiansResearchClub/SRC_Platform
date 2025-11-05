import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function MilestoneItem({ milestone }) {
  return (
    <li className="flex items-center space-x-3">
      {milestone.completed ? (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      ) : (
        <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      )}
      <span
        className={`text-sm ${
          milestone.completed
            ? "line-through text-gray-500 dark:text-gray-400"
            : "text-gray-800 dark:text-gray-200"
        }`}
      >
        {milestone.title}
      </span>
    </li>
  );
}
