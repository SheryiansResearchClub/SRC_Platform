import React from "react";

export default function TeamMemberItem({ member }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const placeholderUrl = `https://placehold.co/40x40/E2E8F0/4A5568?text=${initials}`;
  
  return (
    <div className="flex items-center space-x-3">
      <img
        src={placeholderUrl}
        alt={member.name}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <div className="font-semibold text-sm text-gray-900 dark:text-white flex items-center space-x-1.5">
          {/* Check for 'lead' or 'sub-lead' role and display a badge */}
          {member.role === "lead" && (
            <span className="text-xs font-medium bg-blue-600 text-white px-1.5 py-0.5 rounded">
              Lead
            </span>
          )}
          {member.role === "sub-lead" && (
            <span className="text-xs font-medium bg-sky-600 text-white px-1.5 py-0.5 rounded">
              Sub-Lead
            </span>
          )}

          <span>{member.name}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {member.role}
        </div>
      </div>
    </div>
  );
}