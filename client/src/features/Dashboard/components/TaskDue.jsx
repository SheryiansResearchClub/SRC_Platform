import React, { useContext } from 'react';
import { Radio, CheckCircle } from 'lucide-react';
import ThemeContext from '@/context/ThemeContext';

const TaskDue = ({ tasks }) => {
  const { dark } = useContext(ThemeContext);

  return (
    <div className="flex justify-end">
      <div
        className={`rounded-lg shadow-sm border p-4 w-100 transition-colors duration-300
          ${dark ? 'bg-[#1F1F1F] border-gray-700' : 'bg-white border-gray-100'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2
            className={`text-sm font-semibold ${
              dark ? 'text-gray-100' : 'text-gray-800'
            }`}
          >
            Task Due
          </h2>
          <a
            href="#"
            className={`text-[10px] font-medium transition-colors duration-200 ${
              dark
                ? 'text-gray-200 hover:text-white'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            View All
          </a>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {tasks.slice(0, 3).map((task, index) => {
            const dateObj = task.dueDate ? new Date(task.dueDate) : null;
            const isDone = task.status === 'done';

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-200 ${
                  dark
                    ? 'hover:bg-[#2A2A2A]'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Left section: status + info */}
                <div className="flex items-center space-x-2 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center -ml-1
                      ${
                        isDone
                          ? dark
                            ? 'bg-[#B4DA00]'
                            : 'bg-[#B4DA00]/20'
                          : dark
                          ? 'bg-red-800'
                          : 'bg-red-100'
                      }`}
                  >
                    {isDone ? (
                      <CheckCircle
                        size={14}
                        className={`${dark ? "text-black" : "text-[#B4DA00]"}`}
                      />
                    ) : (
                      <Radio size={14} className={`${dark ? "text-white" : "text-red-500"}`} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`font-medium text-sm truncate ${
                        dark ? 'text-gray-200' : 'text-gray-800'
                      }`}
                    >
                      {task.title}
                    </div>
                    <div
                      className={`text-[12px] truncate ${
                        dark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {dateObj ? dateObj.toLocaleDateString() : 'No date'}
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    isDone
                      ? dark
                        ? 'bg-[#B4DA00] text-black'
                        : 'bg-[#B4DA00]/20 text-[#B4DA00]'
                      : dark
                        ? 'bg-red-900 text-white'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isDone ? 'Done' : 'High'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskDue;
