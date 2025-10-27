import React from 'react';
import { Radio, CheckCircle } from 'lucide-react';

const TaskDue = ({ tasks }) => (
  <div className="flex justify-end">
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 w-100">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-800">Task Due</h2>
        <a href="#" className="text-[10px] font-medium text-gray-500 hover:text-gray-800">View All</a>
      </div>

      <div className="space-y-2">
        {tasks.slice(0, 3).map((task, index) => {
          const dateObj = task.dueDate ? new Date(task.dueDate) : null;
          return (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 min-w-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.status === 'done' ? 'bg-[#B4DA00]/20' : 'bg-red-100'} -ml-1`}>
                  {task.status === 'done' 
                    ? <CheckCircle size={14} className="text-[#B4DA00]" /> 
                    : <Radio size={14} className="text-red-500" />}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 text-sm truncate">{task.title}</div>
                  <div className="text-[12px] text-gray-500 truncate">{dateObj ? dateObj.toLocaleDateString() : 'No date'}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${task.status === 'done' ? 'bg-[#B4DA00]/20 text-[#B4DA00]' : 'bg-red-100 text-red-700'}`}>
                {task.status === 'done' ? 'Done' : 'High'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default TaskDue;
