import { useState, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import { BsClockHistory, BsPersonGear, BsPerson } from "react-icons/bs";
import { MdOutlineErrorOutline, MdOutlineSearch } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RiTodoLine, RiCalendarLine } from "react-icons/ri";
import { IoMdCloseCircleOutline } from "react-icons/io";
import ThemeContext from "@/context/ThemeContext";

const MemberProfile = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { dark } = useContext(ThemeContext);

  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedUser, setSelectedUser] = useState("All Users");
  const [selectedDueDate, setSelectedDueDate] = useState("All Due Dates");

  const member = state?.member || {};

  const [tasks] = useState([
    {
      title: "Fix the SRC Website",
      creator: "Aayush Chouhan",
      assigned: 1,
      created: "10/29/2025",
      due: "10/31/2025",
      status: "Working",
    },
    {
      title: "AROX Landing page",
      creator: "Sarthak Sharma",
      assigned: 1,
      created: "5/29/2025",
      due: "12/31/2025",
      status: "Completed",
    },
    {
      title: "Website Seo",
      creator: "Sarthak Sharma",
      assigned: 1,
      created: "1/29/2025",
      due: "10/31/2025",
      status: "Not Started",
    },
  ]);

 
  const [searchTerm, setSearchTerm] = useState("");

 
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.status.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProject =
        selectedProject === "All Projects" || task.project === selectedProject;

      const matchesState =
        selectedState === "All States" || task.status === selectedState;

      const matchesPriority =
        selectedPriority === "All Priorities" ||
        task.priority === selectedPriority;

      const matchesUser =
        selectedUser === "All Users" ||
        task.assigned === selectedUser ||
        task.creator === selectedUser;

      // 🗓️ Due date filtering (simple demo logic)
      const today = new Date();
      const dueDate = new Date(task.due);
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      let matchesDueDate = true;
      if (selectedDueDate === "Today") matchesDueDate = diffDays === 0;
      if (selectedDueDate === "This Week") matchesDueDate = diffDays <= 7 && diffDays >= 0;
      if (selectedDueDate === "This Month") matchesDueDate = diffDays <= 30 && diffDays >= 0;

      return (
        matchesSearch &&
        matchesProject &&
        matchesState &&
        matchesPriority &&
        matchesUser &&
        matchesDueDate
      );
    });
  }, [
    tasks,
    searchTerm,
    selectedProject,
    selectedState,
    selectedPriority,
    selectedUser,
    selectedDueDate,
  ]);

  // ✅ Calculate task stats
  const stats = [
    {
      title: "Total Tasks",
      count: tasks.length,
      description: "All tasks you can access",
      icon: <RiTodoLine className="text-blue-400 text-xl" />,
    },
    {
      title: "Not Started",
      count: tasks.filter((t) => t.status === "Not Started").length,
      description: "Yet to begin",
      icon: <BsClockHistory className="text-gray-400 text-xl" />,
    },
    {
      title: "Working",
      count: tasks.filter((t) => t.status === "Working").length,
      description: "In progress",
      icon: <BsPersonGear className="text-yellow-400 text-xl" />,
    },
    {
      title: "Completed",
      count: tasks.filter((t) => t.status === "Completed").length,
      description: "Successfully finished",
      icon: <AiOutlineCheckCircle className="text-green-500 text-xl" />,
    },
    {
      title: "Closed",
      count: tasks.filter((t) => t.status === "Closed").length,
      description: "Closed tasks",
      icon: <IoMdCloseCircleOutline className="text-gray-500 text-xl" />,
    },
    {
      title: "Overdue",
      count: tasks.filter((t) => t.status === "Overdue").length,
      description: "Past due date",
      icon: <MdOutlineErrorOutline className="text-red-500 text-xl" />,
    },
  ];

  return (
    <div
      className={`p-4 font-sans -mt-10 ${
        dark ? "bg-[#121212] text-white" : "bg-white text-black"
      }`}
    >
      {/* Back Button */}
      <IoReturnUpBack
        onClick={() => navigate(-1)}
        className={`mb-4 text-2xl cursor-pointer ${
          dark ? "hover:text-gray-200" : "hover:text-gray-600"
        }`}
      />

      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-semibold">{member.name}'s Tasks</h1>
        <p className={`${dark ? "text-[#a1a1a1]" : "text-[#2c2c2c]"}`}>
          Manage and track all your tasks across projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid h-[10rem] grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-start justify-center p-4 rounded-xl border text-center transition-transform hover:scale-[1.02] ${
              dark
                ? "bg-[#1e1e1e] border-[#2d2d2d]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <div className="w-full flex items-center justify-between gap-3 mb-1">
              <span className="text-md font-semibold">{item.title}</span>
              {item.icon}
            </div>
            <p className="text-3xl font-bold">{item.count}</p>
            <p
              className={`text-md mt-3 ${
                dark ? "text-[#a1a1a1]" : "text-gray-600"
              }`}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 mt-10">
          <MdOutlineSearch
            className={`absolute left-3 top-2.5 ${
              dark ? "text-gray-400" : "text-gray-600"
            }`}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} // 🔍
            className={`w-[20rem] pl-10 pr-3 py-2 rounded-md border outline-none text-sm ${
              dark
                ? "bg-[#232323] text-white placeholder-gray-400 border-[#2d2d2d]"
                : "bg-gray-100 text-black placeholder-gray-600 border-gray-300"
            }`}
          />
        </div>
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-2 mt-5 justify-start">
        {/* All Projects */}
        <div>
          <select
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              dark
                ? "bg-[#1f1f1f] border border-[#333] hover:bg-[#2b2b2b] text-white"
                : "bg-gray-200 border border-gray-300 hover:bg-gray-300 text-black"
            }`}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="All Projects">All Projects</option>
            <option value="SRC Team">SRC Team</option>
            <option value="AROX Team">AROX Team</option>
            <option value="Design Team">Design Team</option>
            <option value="Dev Team">Dev Team</option>
          </select>
        </div>

        {/* All States */}
        <div>
          <select
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              dark
                ? "bg-[#1f1f1f] border border-[#333] hover:bg-[#2b2b2b] text-white"
                : "bg-gray-200 border border-gray-300 hover:bg-gray-300 text-black"
            }`}
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="All States">All States</option>
            <option value="Not Started">Not Started</option>
            <option value="Working">Working</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* All Priorities */}
        <div>
          <select
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              dark
                ? "bg-[#1f1f1f] border border-[#333] hover:bg-[#2b2b2b] text-white"
                : "bg-gray-200 border border-gray-300 hover:bg-gray-300 text-black"
            }`}
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="All Priorities">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* All Users → only show if admin */}
        {member.role === "Admin" && (
          <div>
            <select
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
                dark
                  ? "bg-[#1f1f1f] border border-[#333] hover:bg-[#2b2b2b] text-white"
                  : "bg-gray-200 border border-gray-300 hover:bg-gray-300 text-black"
              }`}
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="All Users">All Users</option>
              <option value="Aayush Chouhan">Aayush Chouhan</option>
              <option value="Sarthak Sharma">Sarthak Sharma</option>
              <option value="Rohit Raj">Rohit Raj</option>
              <option value="Priya Mehta">Priya Mehta</option>
            </select>
          </div>
        )}

        {/* All Due Dates */}
        <div>
          <select
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              dark
                ? "bg-[#1f1f1f] border border-[#333] hover:bg-[#2b2b2b] text-white"
                : "bg-gray-200 border border-gray-300 hover:bg-gray-300 text-black"
            }`}
            value={selectedDueDate}
            onChange={(e) => setSelectedDueDate(e.target.value)}
          >
            <option value="All Due Dates">All Due Dates</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
      </div>

      {/* Task List Section */}
      <div className="mt-10 flex flex-col gap-4">
        {filteredTasks.length > 0 ? ( // 🔍
          filteredTasks.map((task, i) => (
            <div
              key={i}
              className={`rounded-lg px-5 py-2 ${
                dark ? "bg-[#181818]" : "bg-gray-100"
              }`}
            >
              <div
                className={`flex flex-wrap items-center justify-between border-b py-4 ${
                  dark ? "border-[#2c2c2c]" : "border-gray-300"
                }`}
              >
                <div className="w-full px-2 py-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-xl">{task.title}</h3>
                    <p
                      className={`text-md ${
                        dark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {task.due}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div
                      className={`flex flex-wrap items-center gap-6 mt-4 text-md ${
                        dark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <BsPerson className="text-xl" /> Creator: {task.creator}
                      </span>
                      <span>Assigned: {task.assigned}</span>
                      <span className="flex items-center gap-1">
                        <RiCalendarLine /> Created: {task.created}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                      <span
                        className={`text-sm px-3 py-1 rounded-full font-semibold ${
                          task.status === "Working"
                            ? dark
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-yellow-100 text-yellow-800"
                            : task.status === "Completed"
                            ? dark
                              ? "bg-green-900 text-green-300"
                              : "bg-green-100 text-green-800"
                            : task.status === "Not Started"
                            ? dark
                              ? "bg-red-900 text-red-300"
                              : "bg-red-100 text-red-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // 🔍 Show message if no tasks match
          <p
            className={`text-center mt-10 ${
              dark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No tasks found matching "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;
