import React, { useState } from "react";
import { useDashboard } from "./hooks/useDashboard";
import ProjectStats from "./components/ProjectStats";
import ProjectTable from "./components/ProjectTable";
import SearchBar from "./components/SearchBar";

export default function Dashboard() {
  const data = useDashboard();
  const [query, setQuery] = useState("");

  if (!data) return null;

  const filtered = data.projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-[#0b0c0d] min-h-screen text-white px-20 py-8 ml-[-4.5vw] mt-[-7vh] mb-[-8.2vh] mr-[-1vw]">
      {/* Sticky Section */}
      <div className="sticky top-0 bg-[#0b0c0d] z-40 pt-8 pb-6">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <p className="text-gray-400 mt-1">
          Manage your team's projects and track their progress.
        </p>
        <div className="mt-6">
          <ProjectStats stats={data.stats} />
        </div>
        <div className="mt-4">
          <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="mt-4">
        <ProjectTable projects={filtered} />
      </div>
    </div>
  );
}
