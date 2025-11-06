import { useState, useContext, useMemo } from "react";
import { useTasks } from "@/features/Task/hooks/useTasks";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import { BsClockHistory, BsPersonGear, BsPerson } from "react-icons/bs";
import { MdOutlineSearch } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RiTodoLine, RiCalendarLine } from "react-icons/ri";
import ThemeContext from "@/context/ThemeContext";
import TaskBox from "./TaskBox";

const AllTasks = () => {
  const navigate = useNavigate();
  const { dark } = useContext(ThemeContext);

  // 👥 Team Members
  const members = ["All Users", "Aayush Chouhan", "Sarthak Sharma", "Arnav Verma"];

  // 🎯 Filters
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedUser, setSelectedUser] = useState("All Users");
  const [selectedDueDate, setSelectedDueDate] = useState("All Due Dates");
  const [searchTerm, setSearchTerm] = useState("");

  // 🧾 Task States
  const { tasks, status, createTask} = useTasks();

  const [newTask, setNewTask] = useState({
    title: "",
    creator: "",
    assigned: "",
    priority: "Medium",
    due: "",
  });

  const [showTaskBox, setShowTaskBox] = useState(false);

  // 🔍 Filtering Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assigned.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.status.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesState =
        selectedState === "All States" || task.status === selectedState;

      const matchesPriority =
        selectedPriority === "All Priorities" || task.priority === selectedPriority;

      const matchesUser =
        selectedUser === "All Users" ||
        task.assigned === selectedUser ||
        task.creator === selectedUser;

      const today = new Date();
      const dueDate = new Date(task.due);
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      let matchesDueDate = true;
      if (selectedDueDate === "Today") matchesDueDate = diffDays === 0;
      if (selectedDueDate === "This Week") matchesDueDate = diffDays <= 7 && diffDays >= 0;
      if (selectedDueDate === "This Month") matchesDueDate = diffDays <= 30 && diffDays >= 0;

      return matchesSearch && matchesState && matchesPriority && matchesUser && matchesDueDate;
    });
  }, [tasks, searchTerm, selectedState, selectedPriority, selectedUser, selectedDueDate]);

  // 📊 Task Stats
  const stats = [
    {
      title: "Total Tasks",
      count: tasks.length,
      icon: <RiTodoLine className="text-blue-400 text-xl" />,
    },
    {
      title: "Not Started",
      count: tasks.filter((t) => t.status === "Not Started").length,
      icon: <BsClockHistory className="text-gray-400 text-xl" />,
    },
    {
      title: "Working",
      count: tasks.filter((t) => t.status === "Working").length,
      icon: <BsPersonGear className="text-yellow-400 text-xl" />,
    },
    {
      title: "Completed",
      count: tasks.filter((t) => t.status === "Completed").length,
      icon: <AiOutlineCheckCircle className="text-green-500 text-xl" />,
    },
  ];

  return (
    <div className={`p-4 font-sans -mt-10 min-h-screen ${dark ? "bg-[#0B0D0E] text-white" : "bg-white text-black"}`}>
      {/* Back Button */}
      <IoReturnUpBack
        onClick={() => navigate(-1)}
        className={`mb-4 text-2xl cursor-pointer ${dark ? "hover:text-gray-200" : "hover:text-gray-600"}`}
      />

      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">All Tasks</h1>
          <button
            onClick={() => setShowTaskBox(true)}
            className="px-3 py-2 bg-green-700 text-white rounded-md hover:scale-95 transition-transform"
          >
             Create New Task
          </button>
        </div>
        <p className={`${dark ? "text-[#a1a1a1]" : "text-[#2c2c2c]"}`}>
          Manage and track all your tasks across projects.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border transition-transform hover:scale-[1.02] ${
              dark ? "bg-[#1e1e1e] border-[#2d2d2d]" : "bg-gray-100 border-gray-300"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{item.title}</span>
              {item.icon}
            </div>
            <p className="text-3xl font-bold mt-2">{item.count}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-[18rem]">
          <MdOutlineSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 rounded-md border ${
              dark ? "bg-[#1a1a1a] border-[#2d2d2d]" : "bg-gray-100 border-gray-300"
            }`}
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="p-2 bg-[#232323] text-white rounded-md border border-[#2d2d2d] hover:bg-[#333333]"
          >
            {["All States", "Not Started", "Working", "Completed"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="p-2 bg-[#232323] text-white rounded-md border border-[#2d2d2d] hover:bg-[#333333]"
          >
            {["All Priorities", "Urgent", "High", "Medium", "Low"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-2 bg-[#232323] text-white rounded-md border border-[#2d2d2d] hover:bg-[#333333]"
          >
            {members.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <select
            value={selectedDueDate}
            onChange={(e) => setSelectedDueDate(e.target.value)}
            className="p-2 bg-[#232323] text-white rounded-md border border-[#2d2d2d] hover:bg-[#333333]"
          >
            {["All Due Dates", "Today", "This Week", "This Month"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="mt-6 flex flex-col gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, i) => (
            <div
              key={i}
              onClick={() => navigate(`/app/all-tasks/task-details`)}
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
                    <h3 className="font-semibold text-lg sm:text-xl">{task.title}</h3>
                    <p className={`text-sm sm:text-md ${dark ? "text-gray-400" : "text-gray-500"}`}>
                      {task.due}
                    </p>
                  </div>

                  <div
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-sm sm:text-md ${
                      dark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-6">
                      <span className="flex items-center gap-2">
                        <BsPerson className="text-xl" /> Creator: {task.creator}
                      </span>
                      <span className="flex items-center gap-2">
                        <BsPerson className="text-xl" /> Assigned: {task.assigned}
                      </span>
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
          <p className={`text-center mt-10 ${dark ? "text-gray-400" : "text-gray-600"}`}>
            No tasks found matching “{searchTerm}”
          </p>
        )}
      </div>

      {/* 🧩 TaskBox Modal */}
      {showTaskBox && (
        <>
          {/* Background Blur */}
          <div
            className="fixed inset-0 backdrop-blur-sm z-40"
            onClick={() => setShowTaskBox(false)}
          ></div>

          {/* Task Creation Box */}
          <TaskBox
            dark={dark}
            closeBox={() => setShowTaskBox(false)}
            newTask={newTask}
            setNewTask={setNewTask}
            onCreate={(task) => createTask(task)}
            members={members}
          />
        </>
      )}
    </div>
  );
};

export default AllTasks;
