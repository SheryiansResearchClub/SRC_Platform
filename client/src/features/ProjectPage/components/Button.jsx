import React from "react";

export default function Button({
  children,
  variant = "secondary",
  icon,
  onClick,
  className = "",
  currentUser,
}) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary:
      "bg-white dark:bg-[#222222] hover:bg-gray-50 dark:hover:bg-[#333333] text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-[#333333] shadow-sm",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-[#333333] text-gray-600 dark:text-gray-300",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
  };

  // Only show if user is admin or leader (for Assign Task button)
  if (children === "Assign Task") {
    const canAssignTask =
      currentUser?.role?.toLowerCase() === "admin" ||
      currentUser?.role?.toLowerCase() === "leader";

    if (!canAssignTask) {
      return null;
    }
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none ${variants[variant]} ${className}`}
    >
      {icon && React.cloneElement(icon, { className: "w-4 h-4" })}
      <span>{children}</span>
    </button>
  );
}
