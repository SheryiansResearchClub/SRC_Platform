import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarSection = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7));
  const changeMonth = (delta) => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ['S','M','T','W','T','F','S'];
  const today = 17;

  return (
    <div className="flex justify-end">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 text-[17]">
            {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
          </h3>
          <div className="flex space-x-1">
            <button onClick={() => changeMonth(-1)} className="text-gray-400 hover:text-gray-600"><ChevronLeft size={16} /></button>
            <button onClick={() => changeMonth(1)} className="text-gray-400 hover:text-gray-600"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-1 text-center">
          {dayNames.map((day, i) => <div key={i} className="text-[15px] font-medium text-gray-500">{day}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`}></div>)}
          {Array.from({ length: daysInMonth }).map((_, day) => {
            const dayNumber = day + 1;
            const isToday = dayNumber === today;
            return (
              <div key={dayNumber} className={`flex items-center justify-center h-6 w-6 text-[14px] rounded-full cursor-pointer ${isToday ? 'bg-[#B4DA00] text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
                {dayNumber}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
