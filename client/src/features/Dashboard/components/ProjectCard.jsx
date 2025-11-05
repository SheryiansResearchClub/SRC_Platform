// Filename: ProjectCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Helper function to get the correct color for the status badge
const getStatusClass = (status) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500/20 text-green-300';
    case 'Completed':
      return 'bg-blue-500/20 text-blue-300';
    case 'On Hold':
      return 'bg-yellow-500/20 text-yellow-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
  }
};

/**
 * This component renders a single project from the dashboard
 * in a mobile-friendly card format.
 */
const ProjectCard = ({ project }) => {
  const navigate = useNavigate(); 

  if (!project) return null;

  const handleCardClick = () => {
    navigate(`/app/project/${project.id}`); // This path is now correct
  };

  return (
    <div
      onClick={handleCardClick} 
      className="bg-[#1F1F1F] border border-gray-700 rounded-lg p-4 space-y-3 shadow-md 
                 cursor-pointer transition-colors duration-150 hover:bg-[#2A2A2A]" 
    >
      
      {/* Top Row: Project Name + Status Badge */}
      <div className="flex justify-between items-start">
        <div className="pr-2">
          <h3 className="font-semibold text-white leading-tight">{project.name}</h3>
          <p className="text-xs text-gray-500 italic mt-1">{project.updated}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 ${getStatusClass(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* Details: Key/Value pairs from the table */}
      <div className="text-sm text-gray-300 space-y-1.5 pt-3 border-t border-gray-700/50">
        <div className="flex">
          <span className="w-20 font-medium text-gray-500 flex-shrink-0">Team:</span>
          <span className="truncate">{project.team}</span>
        </div>
        
        {/* --- ADDED THIS SECTION --- */}
        <div className="flex">
          <span className="w-20 font-medium text-gray-500 flex-shrink-0">Creator:</span>
          <span>{project.creator}</span>
        </div>
        {/* --- END OF ADDED SECTION --- */}

        <div className="flex">
          <span className="w-20 font-medium text-gray-500 flex-shrink-0">Lead:</span>
          <span>{project.lead}</span>
        </div>
        <div className="flex">
          <span className="w-20 font-medium text-gray-500 flex-shrink-0">Due:</span>
          <span>{project.due}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;