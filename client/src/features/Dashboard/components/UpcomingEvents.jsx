import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { EventIcon } from './icons/EventIcon';

const UpcomingEvents = ({ events }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedEvents = showAll ? events : events.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#B4DA00]/20 flex items-center justify-center">
            <Calendar size={16} className="text-[#B4DA00]" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
        </div>
        <button onClick={() => setShowAll(!showAll)} className="text-sm font-medium text-gray-500 hover:text-gray-800">
          {showAll ? "View Less" : "View All"}
        </button>
      </div>

      <div className={`${showAll ? "flex flex-col space-y-3" : "flex space-x-4 overflow-x-auto pb-2"}`}>
        {displayedEvents.map((event, index) => (
          <div key={index} className="min-w-[250px] rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between flex-shrink-0 bg-[#B4DA00]/20">
            <div className="flex flex-col space-y-2">
              <div className="font-bold text-gray-800">{event.title}</div>
              <div className="text-sm text-gray-500">by {event.author}</div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-700">{event.time}</span>
              <EventIcon type={event.type} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
