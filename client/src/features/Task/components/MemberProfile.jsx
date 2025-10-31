import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import ThemeContext from "@/context/ThemeContext";
import TaskBox from "./TaskBox";
import members from "./data";

const MemberProfile = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { dark } = useContext(ThemeContext);
  const [assignTask, setAssignTask] = useState(false);

  const toggleTask = () => setAssignTask((prev) => !prev);

  const member = state?.member || {};
  const isAdmin = member.isAdmin === "true";

  // ✅ Manage state
  const [tasks, setTasks] = useState([
    { name: "Admin panel", done: false },
    { name: "Dashboard", done: false },
    { name: "Notification panel", done: false },
    { name: "Header", done: false },
  ]);

  const [completedTasks, setCompletedTasks] = useState([
    { name: "Navigation bar" },
  ]);

 
  const handleMarkDone = (index) => {
    const taskToMove = tasks[index];
    setTasks((prev) => prev.filter((_, i) => i !== index));
    setCompletedTasks((prev) => [...prev, taskToMove]);
  };

  
  const handleUndo = (index) => {
    const taskToRestore = completedTasks[index];
    setCompletedTasks((prev) => prev.filter((_, i) => i !== index));
    setTasks((prev) => [...prev, { ...taskToRestore, done: false }]);
  };

  return (
    <div
      className={`p-2 font-sans -mt-10 ${
        dark ? "bg-[#121212] text-white" : "bg-white text-black"
      }`}
    >
      {/* Back button */}
      <IoReturnUpBack
        onClick={() => navigate(-1)}
        className={`mb-4 text-2xl cursor-pointer ${
          dark ? "hover:text-gray-200" : "hover:text-gray-600"
        }`}
      />

      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">{member.name}</h1>

        {isAdmin && (
          <button
            onClick={toggleTask}
            className={`px-4 py-1 rounded-full border text-sm ${
              dark
                ? "bg-[#232323] hover:bg-gray-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-black"
            }`}
          >
            Assign
          </button>
        )}
      </div>

      {assignTask && isAdmin && (
        <TaskBox dark={dark} toggleTask={toggleTask} to={member.name} />
      )}

      {/* Info Section */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
        <div>
          <p className={`${dark ? "text-gray-400" : "text-[#1e1e1e]"}`}>Role</p>
          <span className="px-3 py-1 mt-1 inline-block rounded-full bg-purple-200 text-purple-900 font-semibold text-sm">
            Designer
          </span>
        </div>

        <div className="text-lg">
          <p className={`${dark ? "text-gray-400" : "text-[#1e1e1e]"}`}>Email</p>
          <p className="mt-1 text-sm">{member.email}</p>
        </div>

        <div className="text-lg">
          <p className={`${dark ? "text-gray-400" : "text-[#1e1e1e]"}`}>Status</p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold mt-1 inline-block ${
              member.status?.toLowerCase() === "pending"
                ? "bg-red-300 text-red-900"
                : member.status?.toLowerCase() === "completed"
                ? "bg-green-300 text-green-900"
                : member.status?.toLowerCase() === "in progress"
                ? "bg-yellow-300 text-yellow-900"
                : ""
            }`}
          >
            {member.status}
          </span>
        </div>

        {/* Only visible to Admin */}
        {isAdmin && (
          <>
            <div className="text-lg">
              <p className={`${dark ? "text-gray-400" : "text-[#1e1e1e]"}`}>
                Location
              </p>
              <p className="mt-1 text-sm">{member.location}</p>
            </div>

            <div className="text-lg">
              <p className={`${dark ? "text-gray-400" : "text-[#1e1e1e]"}`}>
                Date Hired
              </p>
              <p className="mt-1 text-sm">{member.dateHired}</p>
            </div>
          </>
        )}
      </div>

      {/* Projects Section */}
      <div className="mt-10">
        <h2
          className={`text-2xl font-semibold ${
            dark ? "text-gray-400" : "text-black"
          }`}
        >
          Projects
        </h2>

        {/* Ongoing Tasks */}
        <div className="mt-6">
        <h3
            className={`text-xl font-semibold mb-3 ${
              dark ? "text-gray-300" : "text-black/90"
            }`}
          >
            Ongoing Tasks
          </h3>
        <div
          className={`p-5 rounded-xl border w-full sm:w-[400px] ${
            dark
              ? "bg-[#161616] border-[#262626]"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <h3 className="text-lg font-semibold mb-2">SRC Platform</h3>

          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                dark
                  ? "bg-[#262626] text-gray-300"
                  : "bg-gray-200 text-black"
              }`}
            >
              Open Source
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                dark
                  ? "bg-[#262626] text-gray-300"
                  : "bg-gray-200 text-black"
              }`}
            >
              Full Stack Development
            </span>
          </div>

          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between mt-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                {task.name}
              </div>
              <button
                onClick={() => handleMarkDone(index)}
                className={`text-xs px-3 py-1 rounded-md ${
                  dark
                    ? "bg-green-700 hover:bg-green-600 text-white"
                    : "bg-green-200 hover:bg-green-300 text-green-800"
                }`}
              >
                Mark Done
              </button>
            </div>
          ))}
        </div>
        </div>

        {/* Completed Tasks */}
        <div className="mt-6">
          <h3
            className={`text-xl font-semibold mb-3 ${
              dark ? "text-gray-300" : "text-black"
            }`}
          >
            Completed Tasks
          </h3>

          {completedTasks.length > 0 && (
            <div
              className={`p-5 rounded-xl border w-full sm:w-[400px] ${
                dark
                  ? "bg-[#161616] border-[#262626]"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <h4 className="text-lg font-semibold mb-2">SRC Platform</h4>

              {completedTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mt-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    {task.name}
                  </div>
                  <button
                    onClick={() => handleUndo(index)}
                    className={`text-xs px-3 py-1 rounded-md ${
                      dark
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-black"
                    }`}
                  >
                    Undo
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
