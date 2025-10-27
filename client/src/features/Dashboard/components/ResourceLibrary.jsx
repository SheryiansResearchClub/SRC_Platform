import React, { useState } from 'react';
import { ResourceIcon } from './icons/ResourceIcon';
import { PlayCircle, Download } from 'lucide-react';
import { BookOpen } from 'lucide-react';

const iconColors = ['#B4DA00', '#FF6B6B', '#4D96FF', '#FFA500', '#9B59B6', '#1ABC9C'];

const ResourceLibrary = ({ resources }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedResources = showAll ? resources : resources.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#B4DA00]/20 flex items-center justify-center">
            <BookOpen size={16} className="text-[#B4DA00]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Resource Library</h2>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium text-gray-500 hover:text-gray-800"
        >
          {showAll ? "View Less" : "View All"}
        </button>
      </div>

      <div className={`${showAll ? "flex flex-col space-y-2" : "flex space-x-3 overflow-x-auto pb-2"}`}>
        {displayedResources.map((resource, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-56 p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 ${showAll ? "w-full" : ""}`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <ResourceIcon type={resource.type} color={iconColors[index % iconColors.length]} />
              <div>
                <div className="font-medium text-gray-800 text-sm">{resource.name}</div>
                <div className="text-xs text-gray-500">{resource.author}</div>
              </div>
            </div>
            {resource.type === 'vid' ? (
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-90"
                style={{ backgroundColor: iconColors[index % iconColors.length], color: '#fff' }}
              >
                <PlayCircle size={14} />
              </button>
            ) : (
              <button
                className="hover:opacity-80"
                style={{ color: iconColors[index % iconColors.length] }}
              >
                <Download size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceLibrary;
