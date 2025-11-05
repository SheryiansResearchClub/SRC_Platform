// ProjectsPage.jsx
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

  const currentUser = { name: "Riya Infinity", role: "admin" };
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
    const statusMatch = selectedStatus === "All" || p.status === selectedStatus;
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
    <div className="px-4 sm:px-8 md:px-16 lg:px-10 py-8 md:py-5 bg-[#0B0C0D] min-h-screen">
      {/* Header */}
      <HeaderRow
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        statusOptions={statusOptions}
      />

      {/* Admin Controls */}
      {currentUser.role === "admin" && (
        <div className="flex flex-col sm:flex-row justify-end sm:items-center gap-4 sm:gap-8 mb-6">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-[#1b1c1e] text-white px-3 py-2 rounded-md border border-[#2b2c2e] w-full sm:w-auto"
          >
            {allUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
          <CreateProjectButton setProjects={setProjects} />
        </div>
      )}

      <ProjectSection selectedStatus={selectedStatus} />

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filtered.map((project, i) => (
          <ProjectCard key={i} project={project} />
        ))}
      </div>
    </div>
  );
}
