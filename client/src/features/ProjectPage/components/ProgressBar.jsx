import React from "react";

export default function ProgressBar({ progress }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Overall Progress
        </span>
        <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-[#333333] rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
