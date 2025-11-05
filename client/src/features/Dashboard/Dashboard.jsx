// Filename: src/features/Dashboard/ProjectDashboard.jsx
import React, { useState, useMemo } from "react";
import { checkPermission } from "../../utils/permissions";
import { projectsData } from "./api/dashboardMockApi";
import ProjectStats from "./components/ProjectStats";
import SearchBar from "./components/SearchBar";
import ProjectTable from "./components/ProjectTable";
import ProjectCard from "./components/ProjectCard";

// Mock auth hook for current user
const useAuth = () => ({
  user: { name: "Lana Steiner", role: "leader" },
});

// Extract unique project creators + leads
const getAllUserNames = (projects) => {
  const creators = projects.map((p) => p.creator);
  const leads = projects.map((p) => p.lead);
  return [...new Set([...creators, ...leads].sort())];
};

// Extract unique team names
const getAllTeams = (projects) => {
  const allTeams = projects.flatMap((p) => p.team.split(",").map((t) => t.trim()));
  return ["All Teams", ...new Set(allTeams.sort())];
};

// Filter dropdown values
const dateOptions = ["All Time", "Overdue", "Due Today", "Due This Week"];
const statusOptions = ["All Statuses", "Active", "Completed", "On Hold"];

const allUserNames = getAllUserNames(projectsData.projects);
const allTeams = getAllTeams(projectsData.projects);

export default function ProjectDashboard() {
  const { user: currentUser } = useAuth();
  const canSeeAll = checkPermission(currentUser.role, "canViewAllUsers");

  // Dashboard filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(canSeeAll ? "All Users" : "My Projects");
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [selectedDate, setSelectedDate] = useState("All Time");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // Filter projects dynamically based on user selections
  const filteredData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    let projects = projectsData.projects;

    // Text search filter
    if (searchTerm) {
      projects = projects.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // User filter (My Projects vs All vs specific user)
    if (selectedUser === "My Projects") {
      projects = projects.filter(
        (p) => p.creator === currentUser.name || p.lead === currentUser.name
      );
    } else if (selectedUser !== "All Users") {
      projects = projects.filter((p) => p.creator === selectedUser || p.lead === selectedUser);
    }

    // Team filter
    if (selectedTeam !== "All Teams") {
      projects = projects.filter((p) => p.team.split(", ").includes(selectedTeam));
    }

    // Status filter
    if (selectedStatus !== "All Statuses") {
      projects = projects.filter((p) => p.status === selectedStatus);
    }

    // Due date filter
    if (selectedDate !== "All Time") {
      projects = projects.filter((p) => {
        const due = new Date(p.due);
        due.setHours(0, 0, 0, 0);
        switch (selectedDate) {
          case "Overdue":
            return due < today;
          case "Due Today":
            return due.getTime() === today.getTime();
          case "Due This Week":
            return due >= today && due <= endOfWeek;
          default:
            return true;
        }
      });
    }

    // Stats summary for cards
    const newStats = {
      total: projects.length,
      active: projects.filter((p) => p.status === "Active").length,
      completed: projects.filter((p) => p.status === "Completed").length,
      onHold: projects.filter((p) => p.status === "On Hold").length,
    };

    return { projects, stats: newStats };
  }, [selectedUser, selectedTeam, selectedDate, selectedStatus, searchTerm, currentUser.name]);

  // Mobile stats card UI component
  const MobileProjectStatsCard = ({ iconName, title, value }) => (
    <div className="bg-[#1F1F1F] border border-gray-700 rounded-lg p-4">
      <div className="flex justify-between mb-2">
        <span className="text-2xl text-gray-400">
          <i className={iconName}></i>
        </span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="bg-[#0B0D0E] min-h-screen text-white px-32 pt-12 pb-22 mt-[-6.2vh] ml-[-5vw] mr-[-0.5vw] mb-[-8vh]">
          <div className="sticky top-0 z-10 bg-[#0B0D0E] pb-10">
            {/* Page Title */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-gray-400 mt-1">Manage and track all projects.</p>
            </div>

            {/* Summary Stats */}
            <ProjectStats stats={filteredData.stats} />

            {/* Search & Filters */}
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
              isMobile={false}
            />
          </div>

          {/* Desktop Table */}
          <ProjectTable projects={filteredData.projects} />
        </div>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden bg-[#0B0D0E] text-white min-h-screen p-4">
        <header className="flex justify-center mb-6 h-[40px]">
          <h1 className="text-xl font-bold">Projects</h1>
        </header>

        <p className="text-gray-400 mb-6 text-sm">
          Manage and track team projects.
        </p>

        {/* Mobile Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <MobileProjectStatsCard iconName="ri-folder-line" title="Total Projects" value={filteredData.stats.total} />
          <MobileProjectStatsCard iconName="ri-bar-chart-line" title="Active" value={filteredData.stats.active} />
          <MobileProjectStatsCard iconName="ri-checkbox-circle-line" title="Completed" value={filteredData.stats.completed} />
          <MobileProjectStatsCard iconName="ri-pause-circle-line" title="On Hold" value={filteredData.stats.onHold} />
        </div>

        {/* Search + Filter Button */}
        <div className="flex gap-2 mb-6">
          <div className="flex-grow">
            <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} isMobile={true} />
          </div>
          <button className="bg-[#1F1F1F] border border-gray-700 p-3 rounded-lg flex-shrink-0 aspect-square">
            <i className="ri-filter-3-line text-xl text-gray-300"></i>
          </button>
        </div>

        {/* Mobile Project Cards */}
        <main className="space-y-4">
          {filteredData.projects.length ? (
            filteredData.projects.map((p) => <ProjectCard key={p.id} project={p} />)
          ) : (
            <p className="text-gray-500 text-center py-8">No projects found.</p>
          )}
        </main>
      </div>
    </>
  );
}
