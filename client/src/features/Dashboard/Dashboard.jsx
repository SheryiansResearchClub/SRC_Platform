// Filename: src/features/Dashboard/ProjectDashboard.jsx

import React, { useState, useMemo } from "react";
// ... (Your imports: checkPermission, projectsData, ProjectStats, SearchBar, ProjectTable)
import { checkPermission } from "../../utils/permissions";
import { projectsData } from "./api/dashboardMockApi";
import ProjectStats from "./components/ProjectStats";
import SearchBar from "./components/SearchBar";
import ProjectTable from "./components/ProjectTable";

// --- (useAuth mock hook) ---
const useAuth = () => {
  return {
    user: { name: "Lana Steiner", role: "leader" },
  };
};

// --- (Helper Functions: getAllUserNames, getAllTeams, dateOptions, statusOptions) ---
const getAllUserNames = (projects) => {
  const creators = projects.map(p => p.creator);
  const leads = projects.map(p => p.lead);
  return [...new Set([...creators, ...leads].sort())];
};
const getAllTeams = (projects) => {
  const allTeams = projects.flatMap(p => p.team.split(',').map(t => t.trim()));
  return ["All Teams", ...new Set(allTeams.sort())];
};
const dateOptions = ["All Time", "Overdue", "Due Today", "Due This Week"];
const statusOptions = ["All Statuses", "Active", "Completed", "On Hold"];
// ---

const allUserNames = getAllUserNames(projectsData.projects);
const allTeams = getAllTeams(projectsData.projects);

export default function ProjectDashboard() {
  const { user: currentUser } = useAuth();
  const canSeeAll = checkPermission(currentUser.role, 'canViewAllUsers');

  // --- (State: searchTerm, selectedUser, selectedTeam, etc.) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(
    canSeeAll ? "All Users" : "My Projects"
  );
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [selectedDate, setSelectedDate] = useState("All Time");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // --- (useMemo filtering logic) ---
  const filteredData = useMemo(() => {
    // ... (Your existing filtering logic)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    let projects = projectsData.projects;

    if (searchTerm) {
      projects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedUser === "My Projects") {
      projects = projects.filter(
        (project) =>
          project.creator === currentUser.name || project.lead === currentUser.name
      );
    } else if (selectedUser !== "All Users") {
      projects = projects.filter(
        (project) =>
          project.creator === selectedUser || project.lead === selectedUser
      );
    }
    if (selectedTeam !== "All Teams") {
      projects = projects.filter((project) =>
        project.team.split(', ').includes(selectedTeam)
      );
    }
    if (selectedStatus !== "All Statuses") {
      projects = projects.filter(
        (project) => project.status === selectedStatus
      );
    }
    if (selectedDate !== "All Time") {
      projects = projects.filter((project) => {
        const dueDate = new Date(project.due);
        dueDate.setHours(0, 0, 0, 0);
        switch (selectedDate) {
          case "Overdue": return dueDate < today;
          case "Due Today": return dueDate.getTime() === today.getTime();
          case "Due This Week": return dueDate >= today && dueDate <= endOfWeek;
          default: return true;
        }
      });
    }

    const newStats = {
      total: projects.length,
      active: projects.filter(p => p.status === 'Active').length,
      completed: projects.filter(p => p.status === 'Completed').length,
      onHold: projects.filter(p => p.status === 'On Hold').length,
    };

    return { projects, stats: newStats };
    
  }, [
    selectedUser, 
    selectedTeam, 
    selectedDate, 
    selectedStatus, 
    searchTerm, 
    currentUser.name
  ]);

  return (
    <div
      className="bg-[#0B0D0E] min-h-screen text-white
                 px-22 pt-8 pb-22 
                 mt-[-6.2vh] ml-[-5vw] mr-[-1vw] mb-[-8vh]"
    >
      
      {/* --- 1. ADD STICKY WRAPPER HERE --- */}
      <div className="sticky top-0 z-10 bg-[#0B0D0E] pb-6">

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">
            Manage your team's projects and track their progress.
          </p>
        </div>
        
        {/* Stats */}
        <ProjectStats stats={filteredData.stats} />

        {/* Search Bar */}
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          
          allUserNames={allUserNames}
          selectedUser={selectedUser}
          onUserChange={setSelectedUser}
          canSeeAllUsers={canSeeAll}
          
          allTeams={allTeams}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}

          dateOptions={dateOptions}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}

          statusOptions={statusOptions}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

      </div>
      {/* --- 2. END STICKY WRAPPER --- */}

      {/* Project Table (this part will scroll) */}
      <ProjectTable projects={filteredData.projects} />

    </div>
  );
}