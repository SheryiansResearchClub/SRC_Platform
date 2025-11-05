import React from "react";

export default function Card({ title, icon, children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-[#111315] rounded-lg shadow-sm border border-gray-200 dark:border-[#222222] overflow-hidden ${className}`}
    >
      {title && (
        <div className="flex items-center space-x-3 p-4 md:p-5 border-b border-gray-200 dark:border-[#222222]">
          {icon &&
            React.cloneElement(icon, {
              className: "w-5 h-5 text-gray-500 dark:text-gray-400",
            })}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
      )}
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );
}
