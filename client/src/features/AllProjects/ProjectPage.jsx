import React, { useState, useEffect } from "react";
import { useProjectData } from "./hook/useProjects";
import "remixicon/fonts/remixicon.css";
import HeaderRow from "./components/HeaderRow";
import ProjectSection from "./components/ProjectSection";
import ProjectCard from "./components/ProjectCard";
import CreateProjectButton from "./components/CreateProjectButton";

export default function ProjectsPage() {
  const { projects: initialProjects, loading, error } = useProjectData();
  const [projects, setProjects] = useState(initialProjects || []);
  const statusOptions = ["All", "Ongoing", "Completed", "Todo"];
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedUser, setSelectedUser] = useState("All Users");

  // This would eventually come from backend (via auth API / Redux)
  const currentUser = {
    name: "Riya Infinity",
    role: "admin", // or "member"
  };

  // Example list of users (in real app, fetched from backend)
  const allUsers = [
    "All Users",
    "Riya Infinity",
    "Aarav Patel",
    "Neha Sharma",
    "Vikram Singh",
    "Tanya Verma",
  ];

  useEffect(() => {
    if (initialProjects) setProjects(initialProjects);
  }, [initialProjects]);

  const filtered = projects.filter((p) => {
    const statusMatch =
      selectedStatus === "All" || p.status === selectedStatus;

    const userMatch =
      selectedUser === "All Users" ||
      p.createdBy === selectedUser ||
      p.members?.includes(selectedUser) ||
      p.leads?.includes(selectedUser);

    return statusMatch && userMatch;
  });

  if (loading === "pending")
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300">
        Loading projects...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="px-20 py-10 bg-[#0B0C0D] min-h-screen ml-[-3vw] mt-[-6.5vh] mr-[-1vw] mb-[-8vh]">
      {/* Header */}
      <HeaderRow
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        statusOptions={statusOptions}
      />

      {/* Admin-only controls */}
      {currentUser.role === "admin" && (
        <div className="flex justify-end gap-10 items-center mb-6">
          {/* All Users Dropdown */}
          <div className="relative">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="bg-[#1b1c1e] text-white px-4 py-2 rounded-md border border-[#2b2c2e]"
            >
              {allUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          {/* Create Project Button */}
          <CreateProjectButton setProjects={setProjects} />
        </div>
      )}

      <ProjectSection selectedStatus={selectedStatus} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((project, i) => (
          <ProjectCard key={i} project={project} />
        ))}
      </div>
    </div>
  );
}
