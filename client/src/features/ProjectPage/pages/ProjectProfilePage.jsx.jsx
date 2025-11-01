// ------------------------------------
// React & Imports
// ------------------------------------
import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import Comments from "../components/Comments";
import AddMemberModal from "../components/AddMemberModal";
import { useProjectProfile } from "../hooks/useProjectProfile";
import { rolePermissions } from "../utils/rolePermissions";

// ------------------------------------
// ProjectProfilePage Component
// ------------------------------------
export default function ProjectProfilePage() {
  const { data, loading, error, role } = useProjectProfile();

  const [projectData, setProjectData] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);

  // ------------------------------------
  // Sync Redux data with localStorage comments
  // ------------------------------------
  useEffect(() => {
    if (!data) return;

    const cloned = JSON.parse(JSON.stringify(data));
    const savedComments = localStorage.getItem("projectComments");

    if (savedComments) {
      const stored = JSON.parse(savedComments);
      const uniqueComments = [
        ...cloned.comments,
        ...stored.filter((c) => !cloned.comments.some((d) => d.id === c.id)),
      ];
      cloned.comments = uniqueComments;
    }

    setProjectData(cloned);
  }, [data]);

  // ------------------------------------
  // Handle new comment addition
  // ------------------------------------
  const handleAddComment = (text) => {
    const newComment = {
      id: Date.now(),
      user: {
        name: "You",
        avatar: "https://placehold.co/36x36/444444/ffffff?text=Y",
      },
      message: text,
      time: "Just now",
      type: "status-update",
    };

    setProjectData((prev) => {
      const updated = { ...prev, comments: [...prev.comments, newComment] };
      localStorage.setItem("projectComments", JSON.stringify(updated.comments));
      return updated;
    });
  };

  // ------------------------------------
  // Handle comment deletion
  // ------------------------------------
  const handleDeleteComment = (id) => {
    setProjectData((prev) => {
      const updated = {
        ...prev,
        comments: prev.comments.filter((c) => c.id !== id),
      };
      localStorage.setItem("projectComments", JSON.stringify(updated.comments));
      return updated;
    });
  };

  // ------------------------------------
  // Handle new member addition (for Admin/Leader)
  // ------------------------------------
  const handleAddMember = (member) => {
    setProjectData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, member],
    }));
  };

  // ------------------------------------
  // Loading & Error States
  // ------------------------------------
  if (loading || !projectData) {
    return (
      <div className="bg-[#111111] text-white h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#111111] text-white h-screen flex items-center justify-center">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  // ------------------------------------
  // Main UI Layout (Header & Sidebar removed)
  // ------------------------------------
  return (
    <div className="bg-[#111111] text-white min-h-screen font-sans flex flex-col">
      {/* Main content layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto p-6 space-y-6 md:space-y-0 md:space-x-6">
        {/* Dashboard Section */}
        <div className="relative flex-1">
          <Dashboard data={projectData} />

          {/* Add Member Button for Admin/Leader */}
          {rolePermissions[role]?.canAddMembers && (
            <button
              onClick={() => setShowAddMember(true)}
              className={`absolute top-0 right-0 px-4 py-2 rounded-md text-white ${
                role === "admin"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              + Add Member
            </button>
          )}
        </div>

        {/* Comments Section */}
        <Comments
          comments={projectData.comments}
          onAddComment={handleAddComment}
          onDelete={handleDeleteComment}
        />
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onAdd={handleAddMember}
        />
      )}
    </div>
  );
}
