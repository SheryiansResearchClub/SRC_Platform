// src/features/Dashboard/components/DesktopDashboard.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeContext from "@/context/ThemeContext";
import {
  Search,
  Bell,
  Moon,
  Sun,
  Home,
  BarChart2,
  MessageCircle,
  BookOpen,
  Users,
  FileText,
  Settings,
  ChevronDown,
} from "lucide-react";
import ProjectsSection from "./ProjectsSection";
import ResourceLibrary from "./ResourceLibrary";
import UpcomingEvents from "./UpcomingEvents";
import TaskDue from "./TaskDue";
import CalendarSection from "./CalendarSection";
import { loadDashboardData } from "../slice/dashboardSlice";
import logo from "../../../assets/images/logow.png";
import { useContext } from "react";

export default function DesktopDashboard() {
  const dispatch = useDispatch();
  const { dashboard, ongoingProjects, tasksDueToday, isLoading } = useSelector(
    (state) => state.dashboard
  );

  // State for dropdowns
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("On Going");
  const [selectedDate, setSelectedDate] = useState("Past 60 days");
  const { dark, toggleTheme } = useContext(ThemeContext);

  const statusOptions = ["On Going", "Completed", "Todo"];
  const dateOptions = ["Past 60 days", "Past 30 days", "This week", "Today"];

  useEffect(() => {
    dispatch(loadDashboardData());
  }, [dispatch]);
  if (isLoading) return <div>Loading...</div>;

  return (
    <div
      className={`flex h-screen  font-sans ${
        dark ? "bg-[#121212] text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="w-16 bg-gray-900 flex flex-col items-center py-6 space-y-8 border-r border-[#3d3d3d] ">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <img src={logo} alt="Company Logo" className="w-8 h-8" />
        </div>
        <nav className="flex-1 flex flex-col space-y-6">
          <button className="w-10 h-10 rounded-lg bg-[#B4DA00] flex items-center justify-center text-gray-900">
            <Home size={20} />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
            <BarChart2 size={20} />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
            <MessageCircle size={20} />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
            <BookOpen size={20} />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
            <Users size={20} />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
            <FileText size={20} />
          </button>
        </nav>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
          <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div
          className={` border-b  px-8 py-4 flex items-center justify-between ${
            dark ? "bg-[#121212] border-[#3d3d3d] " : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center flex-1 max-w-lg">
            <Search
              className={` mr-3 ${dark ? "text-gray-200" : "text-gray-400"}`}
              size={20}
            />
            <input
              type="text"
              placeholder="Search for anything..."
              className={`outline-none flex-1 placeholder-gray-400 ${
                dark ? "text-gray-200" : "text-gray-600"
              }`}
            />
          </div>
          <div className="flex items-center space-x-6">
            <div
              onClick={toggleTheme}
              className={`${dark ? "text-white" : "text-gray-400"}`}
            >
              {dark ? (
                <Sun className=" cursor-pointer }" size={20} />
              ) : (
                <Moon className=" cursor-pointer " size={20} />
              )}
            </div>
            <Bell className="text-gray-400 cursor-pointer" size={20} />
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-[#B4DA00]"></div>
              <span className={` font-medium ${dark ? "text-gray-200" : "text-gray-800"}`}>John Doe</span>
              <ChevronDown size={16} className="text-gray-400 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Header with Welcome message and filters */}
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold  ${dark ? "text-gray-200" : "text-gray-800"}`}>
              Welcome back, <span className="text-[#B4DA00]">John!</span>
            </h1>
            <div className={`flex items-center space-x-2  rounded-lg p-1 text-sm font-medium ${dark ? "bg-[#363636] text-gray-200" : "bg-gray-100"}`}>
              {/* Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsStatusOpen(!isStatusOpen);
                    setIsDateOpen(false);
                  }}
                  className="bg-[#B4DA00] text-gray-800 font-semibold py-2 px-4 rounded-lg w-32 flex items-center justify-between"
                >
                  <span>{selectedStatus}</span>
                  <ChevronDown size={16} />
                </button>
                {isStatusOpen && (
                  <div className={`absolute left-0 mt-2 w-48  rounded-md shadow-lg py-1 z-10 ${dark ? "bg-[#363636]" : "bg-white"}`}>
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedStatus(option);
                          setIsStatusOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm  w-full text-left ${dark ? "text-gray-200 hover:bg-[#232323]" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Range Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsDateOpen(!isDateOpen);
                    setIsStatusOpen(false);
                  }}
                  className={` py-2 px-4 rounded-lg flex items-center justify-between w-40 ${dark ? " text-gray-200" : "text-gray-500"}`}
                >
                  <span>{selectedDate}</span>
                  <ChevronDown size={16} />
                </button>
                {isDateOpen && (
                  <div className={`absolute right-0 mt-2 w-48  rounded-md shadow-lg py-1 z-10 ${dark ? "bg-[#363636]" : "bg-white"}`}>
                    {dateOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedDate(option);
                          setIsDateOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm  w-full text-left ${dark ? "text-gray-200 hover:bg-[#232323]" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProjectsSection projects={ongoingProjects} />
              <ResourceLibrary resources={dashboard.resources} />
              <UpcomingEvents events={dashboard.events} />
            </div>
            <div className="space-y-6">
              <TaskDue tasks={tasksDueToday} />
              <CalendarSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
