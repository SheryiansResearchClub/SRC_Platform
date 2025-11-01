import React from "react";
import StatusDropdown from "./StatusDropdown";
import CreateProjectButton from "./CreateProjectButton"; // new component
import { checkPermission } from "@/utils/permissions";

export default function HeaderRow({
  selectedStatus,
  setSelectedStatus,
  statusOptions,
  userRole = "admin", // pass actual role from context or props later
}) {
  const canCreateProject = checkPermission(userRole, "canCreateProject");

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold text-white">All Projects</h1>

      <div className="flex items-center gap-3">
        <StatusDropdown
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          statusOptions={statusOptions}
        />
        {/* {canCreateProject && <CreateProjectButton />} */}
      </div>
    </div>
  );
}
