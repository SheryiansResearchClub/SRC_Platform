// src/features/Dashboard/components/DesktopDashboard.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeContext from "@/context/ThemeContext";
import { ChevronDown } from "lucide-react";
import ProjectsSection from "./ProjectsSection";
import ResourceLibrary from "./ResourceLibrary";
import UpcomingEvents from "./UpcomingEvents";
import TaskDue from "./TaskDue";
import CalendarSection from "./CalendarSection";
import { loadDashboardData } from "../slice/dashboardSlice";
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
  const { dark } = useContext(ThemeContext);

  const statusOptions = ["On Going", "Completed", "Todo"];
  const dateOptions = ["Past 60 days", "Past 30 days", "This week", "Today"];

  useEffect(() => {
    dispatch(loadDashboardData());
  }, [dispatch]);
  if (isLoading) return <div>Loading...</div>;

  return (
    <div
      className={`flex px-2 font-sans ${dark ? "bg-[#121212] text-gray-200" : "bg-white text-gray-800"
        }`}
    >
      <div className="flex-1 overflow-auto">
        <div className="">
          {/* Header with Welcome message and filters */}
          <div className="flex justify-between items-center mb-8">
            <h1
              className={`text-3xl font-bold  ${dark ? "text-gray-200" : "text-gray-800"
                }`}
            >
              Welcome back, <span className="text-[#B4DA00]">John!</span>
            </h1>
            <div
              className={`flex items-center space-x-2  rounded-lg p-1 text-sm font-medium ${dark ? "bg-[#363636] text-gray-200" : "bg-gray-100"
                }`}
            >
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
                  <div
                    className={`absolute left-0 mt-2 w-48  rounded-md shadow-lg py-1 z-10 ${dark ? "bg-[#363636]" : "bg-white"
                      }`}
                  >
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedStatus(option);
                          setIsStatusOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm  w-full text-left ${dark
                            ? "text-gray-200 hover:bg-[#232323]"
                            : "text-gray-700 hover:bg-gray-100"
                          }`}
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
                  className={` py-2 px-4 rounded-lg flex items-center justify-between w-40 ${dark ? " text-gray-200" : "text-gray-500"
                    }`}
                >
                  <span>{selectedDate}</span>
                  <ChevronDown size={16} />
                </button>
                {isDateOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48  rounded-md shadow-lg py-1 z-10 ${dark ? "bg-[#363636]" : "bg-white"
                      }`}
                  >
                    {dateOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedDate(option);
                          setIsDateOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm  w-full text-left ${dark
                            ? "text-gray-200 hover:bg-[#232323]"
                            : "text-gray-700 hover:bg-gray-100"
                          }`}
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
