import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import ThemeContext from "@/context/ThemeContext";
import TaskBox from "./TaskBox";
import members from "./data"; // ✅ Import all members

const MemberProfile = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { dark } = useContext(ThemeContext);
  const [assignTask, setAssignTask] = useState(false);

  const toggleTask = () => setAssignTask((prev) => !prev);

 
  const member = state?.member || {};


  const isAdmin = member.isAdmin === "true";

  const ongoingProjects = [
    {
      title: "SRC Platform",
      description:
        "We’re not just another college club — we’re a collective of curious minds, restless builders, and ambitious dreamers who believe in turning wild ideas into tangible things.",
      tags: ["Open Source", "Full Stack Development"],
      tasks: [
        { name: "Complete the navigation bar", done: true },
        { name: "Complete the dashboard", done: false },
      ],
    },
  ];

  const completedProjects = [
    { title: "Full Stack App", progress: 32 },
    { title: "Web based sharing", progress: 92 },
  ];

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

        {/* Only admin can assign */}
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
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm text-center">
        <div className="text-lg">
          <p className={`${dark ? "text-gray-400" : "text-[#1e1e1e]"}`}>Role</p>
          <div className="mt-1">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                member.role?.toLowerCase().includes("designer")
                  ? "bg-purple-300 text-purple-900"
                  : member.role?.toLowerCase().includes("backend")
                  ? "bg-green-200 text-green-900"
                  : member.role?.toLowerCase().includes("strategist")
                  ? "bg-yellow-200 text-yellow-900"
                  : "bg-pink-200 text-red-800"
              }`}
            >
              {member.role}
            </span>
          </div>
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

        {/* Ongoing Projects */}
        <div className="mt-6">
          <h3
            className={`text-xl font-semibold mb-3 ${
              dark ? "text-gray-400" : "text-black/90"
            }`}
          >
            Ongoing
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ongoingProjects.map((project, i) => {
              const totalTasks = project.tasks.length;
              const completedTasks = project.tasks.filter((t) => t.done).length;

              return (
                <div
                  key={i}
                  className={`p-5 rounded-xl border ${
                    dark
                      ? "bg-[#161616] border-[#262626]"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <h4 className="text-lg font-semibold mb-2">
                    {project.title}
                  </h4>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag, t) => (
                      <span
                        key={t}
                        className={`px-3 py-1 rounded-full text-xs ${
                          dark
                            ? "bg-[#262626] text-gray-300"
                            : "bg-[#d4d4d4] text-black"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p
                    className={`text-sm mb-2 ${
                      dark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Tasks Completed:{" "}
                    <span className="font-semibold text-green-500">
                      {completedTasks}
                    </span>{" "}
                    / {totalTasks}
                  </p>

                  <ul className="space-y-1 text-sm">
                    {project.tasks.map((task, j) => (
                      <li
                        key={j}
                        className={`flex items-center gap-2 ${
                          task.done ? "text-gray-500 line-through" : ""
                        } ${dark ? "text-white" : "text-black"}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            task.done ? "bg-gray-600" : "bg-green-500"
                          }`}
                        ></span>
                        {task.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Projects */}
        <div className="mt-10">
          <h3
            className={`text-xl font-semibold mb-3 ${
              dark ? "text-gray-400" : "text-black/90"
            }`}
          >
            Completed
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedProjects.map((project, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl border flex flex-col items-start ${
                  dark
                    ? "bg-[#161616] border-[#262626]"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <h4 className="text-lg font-semibold mb-2">{project.title}</h4>
                <div
                  className={`text-sm font-semibold mb-2 ${
                    project.progress >= 80 ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {project.progress}% Completed
                </div>
                <p
                  className={`text-xs ${
                    dark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  • All major tasks finished successfully
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;