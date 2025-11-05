import React from "react";
import StatusDropdown from "./StatusDropdown";
import CreateProjectButton from "./CreateProjectButton"; // new component
import { checkPermission } from "@/utils/permissions";

export default function HeaderRow({
  selectedStatus,
  setSelectedStatus,
  statusOptions,
  userRole = "member", // pass actual role from context or props later
}) {
  const canCreateProject = checkPermission(userRole, "canCreateProject");

  return (
    <div className="flex items-center justify-between mb-8">

      <div className="flex-col space-y-3">

        <h1 className="text-4xl  text-white">All Projects</h1>
        <h1 className="text-md  text-gray-400">See All your Projects</h1>


      </div>



      <div className="flex items-center gap-3">
        <StatusDropdown
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          statusOptions={statusOptions}
        />

      </div>
    </div>
  );
}
