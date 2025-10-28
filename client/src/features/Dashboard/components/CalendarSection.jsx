import React, { useState, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ThemeContext from '@/context/ThemeContext';

const CalendarSection = () => {
  const { dark } = useContext(ThemeContext);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7));

  const changeMonth = (delta) =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    );

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = 17;
  const isCurrentMonth =
    new Date().getMonth() === currentMonth.getMonth() &&
    new Date().getFullYear() === currentMonth.getFullYear();

  return (
    <div className="flex justify-end">
      <div
        className={`rounded-lg shadow-sm border p-6 w-100 transition-colors duration-300
          ${dark ? 'bg-[#1F1F1F] border-gray-700' : 'bg-white border-gray-100'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3
            className={`font-semibold text-[17px] ${
              dark ? 'text-gray-100' : 'text-gray-800'
            }`}
          >
            {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
          </h3>

          <div className="flex space-x-1">
            <button
              onClick={() => changeMonth(-1)}
              className={`transition-colors ${
                dark
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => changeMonth(1)}
              className={`transition-colors ${
                dark
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {dayNames.map((day, i) => (
            <div
              key={i}
              className={`text-[15px] font-medium ${
                dark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {day}
            </div>
          ))}

          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, day) => {
            const dayNumber = day + 1;
            const isTodayDay = isCurrentMonth && dayNumber === today;

            return (
              <div
                key={dayNumber}
                className={`flex items-center justify-center h-6 w-6 text-[14px] rounded-full cursor-pointer transition-colors duration-150
                  ${
                    isTodayDay
                      ? 'bg-[#B4DA00] text-white font-semibold'
                      : dark
                      ? 'text-gray-300 hover:bg-[#2A2A2A]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
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
