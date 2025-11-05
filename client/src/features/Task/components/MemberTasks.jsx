import { useState, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import { BsClockHistory, BsPersonGear, BsPerson } from "react-icons/bs";
import { MdOutlineErrorOutline, MdOutlineSearch } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RiTodoLine, RiCalendarLine } from "react-icons/ri";
import { IoMdCloseCircleOutline } from "react-icons/io";
import ThemeContext from "@/context/ThemeContext";
import { useTasks } from "@/features/Task/hooks/useTasks";


const MemberTasks = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { dark } = useContext(ThemeContext);

  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedUser, setSelectedUser] = useState("All Users");
  const [selectedDueDate, setSelectedDueDate] = useState("All Due Dates");

  const member = state?.member || {};

  const { tasks, status, createTask} = useTasks();

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

      const today = new Date();
      const dueDate = new Date(task.due);
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      let matchesDueDate = true;
      if (selectedDueDate === "Today") matchesDueDate = diffDays === 0;
      if (selectedDueDate === "This Week")
        matchesDueDate = diffDays <= 7 && diffDays >= 0;
      if (selectedDueDate === "This Month")
        matchesDueDate = diffDays <= 30 && diffDays >= 0;

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
        dark ? "bg-[#0B0D0E] text-white" : "bg-white text-black"
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
        <h1 className="text-2xl sm:text-3xl font-semibold">
          {member.name}'s Tasks
        </h1>
        <p className={`${dark ? "text-[#a1a1a1]" : "text-[#2c2c2c]"}`}>
          Manage and track all your tasks across projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-start justify-center p-4 rounded-xl border transition-transform hover:scale-[1.02] ${
              dark
                ? "bg-[#1e1e1e] border-[#2d2d2d]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <div className="w-full flex items-center justify-between gap-3 mb-1">
              <span className="text-sm sm:text-md font-semibold">
                {item.title}
              </span>
              {item.icon}
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{item.count}</p>
            <p
              className={`text-xs sm:text-sm mt-2 ${
                dark ? "text-[#a1a1a1]" : "text-gray-600"
              }`}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-[20rem]">
          <MdOutlineSearch
            className={`absolute left-3 top-2.5 ${
              dark ? "text-gray-400" : "text-gray-600"
            }`}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 rounded-md border outline-none text-sm ${
              dark
                ? "bg-[#232323] text-white placeholder-gray-400 border-[#2d2d2d]"
                : "bg-gray-100 text-black placeholder-gray-600 border-gray-300"
            }`}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mt-5">
        {[{
          label: "All Projects",
          value: selectedProject,
          setter: setSelectedProject,
          options: ["All Projects", "SRC Team", "AROX Team", "Design Team", "Dev Team"]
        },
        {
          label: "All States",
          value: selectedState,
          setter: setSelectedState,
          options: ["All States", "Not Started", "Working", "Completed"]
        },
        {
          label: "All Priorities",
          value: selectedPriority,
          setter: setSelectedPriority,
          options: ["All Priorities", "Urgent", "High", "Medium", "Low"]
        },
        {
          label: "All Due Dates",
          value: selectedDueDate,
          setter: setSelectedDueDate,
          options: ["All Due Dates", "Today", "This Week", "This Month"]
        }].map((filter, i) => (
          <select
            key={i}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              dark
                ? "bg-[#1f1f1f] border border-[#333] hover:bg-[#2b2b2b] text-white"
                : "bg-gray-200 border border-gray-300 hover:bg-gray-300 text-black"
            }`}
            value={filter.value}
            onChange={(e) => filter.setter(e.target.value)}
          >
            {filter.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Task List Section */}
      <div className="mt-10 flex flex-col gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, i) => (
            <div
              key={i}
              className={`rounded-lg px-4 sm:px-5 py-4 cursor-pointer ${
                dark ? "bg-[#181818]" : "bg-gray-100"
              }`}
            >
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2 ${
                  dark ? "border-[#2c2c2c]" : "border-gray-300"
                }`}
              >
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-lg sm:text-xl">
                      {task.title}
                    </h3>
                    <p
                      className={`text-sm sm:text-md ${
                        dark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {task.due}
                    </p>
                  </div>

                  <div
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-sm sm:text-md ${
                      dark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-2">
                        <BsPerson className="text-xl" /> Creator: {task.creator}
                      </span>
                      <span>Assigned: {task.assigned}</span>
                      <span className="flex items-center gap-1">
                        <RiCalendarLine /> Created: {task.created}
                      </span>
                      <span
                        className={`text-sm px-3 py-1 rounded-full font-semibold ${
                          task.priority === "Low"
                            ? dark
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-yellow-100 text-yellow-800"
                            : task.priority === "Medium"
                            ? dark
                              ? "bg-blue-900 text-blue-300"
                              : "bg-blue-100 text-blue-800"
                            : task.priority === "High"
                            ? dark
                              ? "bg-red-900 text-red-300"
                              : "bg-red-100 text-red-800"
                            : dark
                            ? "bg-purple-900 text-purple-300"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="mt-3 sm:mt-0">
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
                            : dark
                            ? "bg-red-900 text-red-300"
                            : "bg-red-100 text-red-800"
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

export default MemberTasks;
