import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import AddMemberModal from "../components/AddMemberModal";
import { rolePermissions } from "../utils/rolePermissions";

export default function LeaderDashboard({ data }) {
  const [showAddMember, setShowAddMember] = useState(false);

  return (
    <div className="relative">
      <Dashboard data={data} />

      {rolePermissions.leader.canAddMembers && (
        <button
          onClick={() => setShowAddMember(true)}
          className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Member
        </button>
      )}

      {showAddMember && (
        <AddMemberModal onClose={() => setShowAddMember(false)} />
      )}
    </div>
  );
}
