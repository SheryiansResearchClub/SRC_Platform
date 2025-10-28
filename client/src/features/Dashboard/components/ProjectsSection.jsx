import React, { useContext } from "react";
import ThemeContext from "@/context/ThemeContext";
import ProjectCard from "./ProjectCard";
import { Radio } from "lucide-react";

const ProjectsSection = ({ projects }) => {
  const { dark} = useContext(ThemeContext);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 rounded-full  flex items-center justify-center ${
              dark ? "bg-[#B4DA00] " : "bg-[#B4DA00]/20 "
            }`}
          >
            <Radio
              size={16}
              className={`${dark ? " text-black" : " text-[#B4DA00]"}`}
            />
          </div>
          <h2 className={`text-xl font-semibold  ${dark ? "text-gray-200" : 'text-gray-800'}`}>
            On Going Projects
          </h2>
        </div>
        <a
          href="#"
          className={`text-sm font-medium  ${dark ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
        >
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.slice(0, 3).map((project) => (
          <ProjectCard key={project.projectId} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
