import React from 'react';
import ProjectCard from './ProjectCard';
import { Radio } from 'lucide-react';

const ProjectsSection = ({ projects }) => (
  <div>
    <div className="flex  items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-[#B4DA00]/20 flex items-center justify-center">
          <Radio size={16} className="text-[#B4DA00]" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">On Going Projects</h2>
      </div>
      <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-800">View All</a>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.slice(0, 3).map(project => <ProjectCard key={project.projectId} project={project} />)}
    </div>
  </div>
);

export default ProjectsSection;
