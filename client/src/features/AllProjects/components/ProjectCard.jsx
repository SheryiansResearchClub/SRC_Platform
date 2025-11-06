import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  const addImageFallback = (e) => {
    e.currentTarget.src = "https://placehold.co/40x40/555/fff?text=ERR";
  };

  const handleClick = () => {
    navigate(`/app/project/${project.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-[#1e1e1e] rounded-xl border border-[#2d2d2d] p-5 hover:bg-[#333333] transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
        <span className="text-xs bg-[#1e2022] text-gray-300 px-3 py-1 rounded-full">
          {project.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag, idx) => (
          <span
            key={idx}
            className="text-xs text-gray-300 bg-[#1b1c1e] border border-[#2b2c2e] px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-400 space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Created by</span>
          <span className="text-gray-200 font-medium">{project.createdBy}</span>
        </div>
        <div className="flex justify-between">
          <span>Created on</span>
          <span className="text-gray-200 font-medium">{project.createdOn}</span>
        </div>
        <div className="flex justify-between">
          <span>Lead</span>
          <span className="text-gray-200 font-medium">{project.lead}</span>
        </div>
      </div>

      {project.contributors?.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-2">
            {project.contributors.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onError={addImageFallback}
                alt="user"
                className="w-8 h-8 rounded-full border border-[#2b2c2e]"
              />
            ))}
          </div>
          <p className="text-sm text-gray-400">+5 contributors</p>
        </div>
      )}

      <p className="text-xs text-gray-500 border-t border-[#1f1f1f] pt-3">
        Latest update • 2d ago
      </p>
    </div>
  );
}
