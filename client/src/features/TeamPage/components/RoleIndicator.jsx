import React from "react";
import { BsDot } from "react-icons/bs";

export default function RoleIndicator({ role }) {
  let colorClass = "";
  if (role === "lead") colorClass = "text-pink-500";
  else if (role === "sub-lead") colorClass = "text-yellow-500";
  else colorClass = "text-gray-400";

  return <BsDot className={`w-6 h-6 scale-[2.2] -ml-2 ${colorClass}`} />;
}
