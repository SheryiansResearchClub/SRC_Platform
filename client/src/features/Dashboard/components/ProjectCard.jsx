import React from 'react';
import { Radio, CheckCircle, MessageCircle, Paperclip } from 'lucide-react';

const tagColors = [
   '#66946B', // Teal
  '#FF6B6B', // Red
  '#4D96FF', // Blue
  '#FFA500', // Orange
  '#9B59B6', // Purple
 
  '#F39C12', // Dark Orange
];

const ProjectCard = ({ project }) => (
  <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-3 w-[280px] h-[150px] flex flex-col justify-between">
    <div className="flex items-center justify-between mb-2">
      <div className="w-full bg-gray-200 rounded-full h-1 mr-2">
        <div
          className="h-1 rounded-full"
          style={{ width: `${project.progress}%`, backgroundColor: '#B4DA00' }}
        ></div>
      </div>
      <span className="text-[10px] font-semibold text-gray-700">
        {project.progress}%
      </span>
    </div>

    <div className="flex items-center mb-1">
      <div className="flex -space-x-1.5">
        {project.members?.slice(0, 4).map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className="w-5 h-5 rounded-full border-2 border-white object-cover"
          />
        ))}
      </div>
    </div>

    <div className="flex items-start justify-between">
      <div className="space-y-0.5">
        <h3 className="font-semibold text-sm text-gray-900 truncate">{project.title}</h3>
      </div>

      <span
        className="px-2 py-0.5 rounded-full text-[12px] font-medium"
        style={{
          backgroundColor: `${tagColors[0]}40`, // darker shade (~25-30% opacity)
          color: tagColors[0],
        }}
      >
        {project.category}
      </span>
    </div>

    <div className="flex items-center justify-between mt-2">
      <div className="flex flex-wrap items-center gap-1">
        {project.tags?.slice(0, 3).map((tag, index) => (
          <span
            key={tag}
            className="rounded px-1.5 py-0.5 text-[12px] font-medium"
            style={{
              backgroundColor: `${tagColors[index % tagColors.length]}40`, // darker shade
              color: tagColors[index % tagColors.length],
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center space-x-1.5 text-gray-400">
        <MessageCircle size={14} />
        <Paperclip size={14} />
      </div>
    </div>
  </div>
);

export default ProjectCard;
