import React from "react";

export default function ProjectSection({ selectedStatus }) {
  // If "All" is selected, show "All Projects", else "<Status> Projects"
  const heading =
    selectedStatus === "All"
      ? "All Projects"
      : `${selectedStatus} Projects`;

  return (
    <div className="flex items-center gap-3 mb-6">
      <i className="ri-crosshair-line text-grey-300 text-2xl"></i>
      <h2 className="text-xl font-semibold text-white">{heading}</h2>
    </div>
  );
}
