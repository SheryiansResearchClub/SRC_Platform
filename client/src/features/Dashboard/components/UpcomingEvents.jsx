import React, { useState } from 'react';
import ThemeContext from '@/context/ThemeContext';
import { Calendar } from 'lucide-react';
import { EventIcon } from './icons/EventIcon';
import { useContext } from 'react';

const UpcomingEvents = ({ events }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedEvents = showAll ? events : events.slice(0, 3);

  const {dark} = useContext(ThemeContext)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full  flex items-center justify-center ${
              dark ? "bg-[#B4DA00] " : "bg-[#B4DA00]/20 "
            }`}>
            <Calendar size={16} className={`${dark ? " text-black" : " text-[#B4DA00]"}`} />
          </div>
          <h2 className={`text-xl font-semibold  ${dark ? "text-gray-200" : 'text-gray-800'}`}>Upcoming Events</h2>
        </div>
        <button onClick={() => setShowAll(!showAll)}  className={`text-sm font-medium  ${dark ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>
          {showAll ? "View Less" : "View All"}
        </button>
      </div>

      <div
  className={`${
    showAll
      ? "flex flex-col space-y-3"
      : "flex space-x-4 overflow-x-auto pb-2"
  }`}
>
  {displayedEvents.map((event, index) => (
    <div
      key={index}
      className={`min-w-[250px] rounded-xl shadow-sm p-4 flex items-center justify-between flex-shrink-0 transition-colors duration-300 
        ${
          dark
            ? "bg-[#1F1F1F] border border-gray-700 hover:bg-[#2A2A2A]"
            : "bg-[#B4DA00]/20 border border-gray-100 hover:bg-[#B4DA00]/30"
        }`}
    >
      <div className="flex flex-col space-y-2">
        <div
          className={`font-bold ${
            dark ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {event.title}
        </div>
        <div
          className={`text-sm ${
            dark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          by {event.author}
        </div>
      </div>
      <div className="flex items-center space-x-3 mt-2">
        <span
          className={`font-medium ${
            dark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {event.time}
        </span>
        <EventIcon  type={event.type} />
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default UpcomingEvents;
