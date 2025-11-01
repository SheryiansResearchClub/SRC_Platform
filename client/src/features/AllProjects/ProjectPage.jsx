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

  useEffect(() => {
    if (initialProjects) setProjects(initialProjects);
  }, [initialProjects]);

  const filtered =
    selectedStatus === "All"
      ? projects
      : projects.filter((p) => p.status === selectedStatus);

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
      <HeaderRow
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        statusOptions={statusOptions}
      />

      <div className="flex justify-end mb-6">
        <CreateProjectButton setProjects={setProjects} />
      </div>

      
<ProjectSection selectedStatus={selectedStatus} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((project, i) => (
          <ProjectCard key={i} project={project} />
        ))}
      </div>
    </div>
  );
}
