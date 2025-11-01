import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import AddMemberModal from "../components/AddMemberModal";
import { rolePermissions } from "../utils/rolePermissions";

export default function AdminDashboard({ data }) {
  const [showAddMember, setShowAddMember] = useState(false);

  return (
    <div className="relative">
      {/* Pass currentUserRole as 'admin' so Dashboard knows */}
      <Dashboard data={data} currentUserRole="admin" />

      {/* Add Member button visible only for admin */}
      {rolePermissions.admin.canAddMembers && (
        <button
          onClick={() => setShowAddMember(true)}
          className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Add Member
          
        </button>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMemberModal onClose={() => setShowAddMember(false)} />
      )}
    </div>
  );
}
