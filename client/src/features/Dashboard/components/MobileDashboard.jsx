// src/features/Dashboard/components/MobileDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Moon,
  Sun,
  Zap,
  Menu,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Users,
  Calendar,
  Paperclip,
  MessageCircle,
  Share2,
  MessageSquare,
  Download,
  FileText,
  X,
  Home,
  Briefcase,
  LogOut,
  ClipboardCheck,
} from "lucide-react";
import { dashboardMockApi } from "../api/dashboardMockApi";
import ThemeContext from "@/context/ThemeContext";

import logo from "../../../assets/images/logow.png";
import { useContext } from "react";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { icon: Home, label: "Dashboard" },
    { icon: Briefcase, label: "Projects" },
    { icon: MessageCircle, label: "Chat" },
    { icon: FileText, label: "Resources" },
    { icon: Users, label: "Members" },
    { icon: Calendar, label: "Events" },
  ];

  const { dark, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className={`fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs bg-black text-white p-6 shadow-xl transition-transform duration-300 ease-in-out flex flex-col
                ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex justify-between items-center mb-10 flex-shrink-0">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <img src={logo} alt="Company Logo" className="w-8 h-8 rounded-full" />
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <nav className="flex flex-col space-y-6 flex-shrink-0">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className="flex items-center space-x-4 text-lg text-gray-200 hover:text-white group"
          >
            <div className="p-2 bg-[#D8FF4B] rounded-lg">
              <item.icon size={20} className="text-black" />
            </div>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="flex-grow"></div>

      <div className="flex items-center justify-between space-x-2 flex-shrink-0">
        <button className="flex flex-1 justify-center items-center space-x-2 bg-[#D8FF4B] text-black font-semibold px-4 py-3 rounded-lg text-sm">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
        <button className="flex flex-1 justify-center items-center space-x-2 bg-gray-700 text-white font-semibold px-4 py-3 rounded-lg text-sm hover:bg-gray-600">
          <ClipboardCheck size={16} />
          <span>Task Due</span>
        </button>
      </div>
    </div>
  );
};

const MobileDashboard = () => {
  const [onGoingProjects, setOnGoingProjects] = useState([]);
  const [resourceLibrary, setResourceLibrary] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { dark, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const dashboardData = dashboardMockApi.getDashboard();
    const projects = dashboardMockApi.getOngoingProjects();

    setOnGoingProjects(
      projects.map((p) => ({
        id: p.projectId,
        title: p.title,
        progress: p.progress,
        dueDate: new Date(p.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        tags: p.tags,
        members: p.members,
      }))
    );

    setResourceLibrary(
      dashboardData.resources.map((r, i) => ({
        id: i + 1,
        title: r.name,
        author: `by ${r.author}`,
        icon: r.type,
      }))
    );
  }, []);

  const getTagStyles = (tag) => {
    switch (tag.toLowerCase()) {
      case "design":
        return "bg-[#E2F7F0] text-[#71C5A5]";
      case "ai":
        return "bg-[#E6F0FF] text-[#6A9DEE]";
      case "high":
        return "bg-[#FCE6E6] text-[#E88989]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      className={`flex flex-col w-full min-h-screen   relative overflow-x-hidden ${
        dark ? "bg-[#121212] text-gray-200" : "bg-[#F9F9F9] text-gray-800"
      }`}
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <header
        className={`flex justify-between items-center sticky top-0 z-10 bg-black  px-6 py-2 ${
          dark ? " border-b border-[#454545]" : ""
        }`}
      >
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center ">
          <img src={logo} alt="Company Logo" className="w-8 h-8 rounded-full" />
        </div>
        <div className="flex items-center space-x-4">
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
          <button onClick={() => setIsSidebarOpen(true)} className="text-white">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-7">
        <div>
          <p className="text-2xl">Welcome back,</p>
          <h1 className="text-3xl font-bold text-[#A5C33E]">John</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="bg-[#D8FF4B] border-[1.5px] text-black font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 text-sm">
            <span>On Going</span>
            <ChevronDown size={16} />
          </button>
          <button
            className={` border-[1.5px] p-2 rounded-lg border-zinc-300 flex items-center space-x-2 text-sm ${
              dark ? "text-gray-200" : "text-gray-600"
            }`}
          >
            <span>Past 60 days</span>
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Ongoing Projects */}
        <div>
          <div className="flex justify-between items-center mb-7">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2  rounded-full ${
                  dark ? "bg-[#B4DA00]" : "bg-[#EAF6DA]"
                }`}
              >
                <RefreshCw
                  size={20}
                  className={`${dark ? "text-black" : "text-[#A5C33E]"}`}
                />
              </div>
              <h2 className="text-lg font-semibold ">On Going Projects</h2>
            </div>
            <button
              className={`flex items-center text-sm font-semibold  ${
                dark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              <span>View All</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-7">
            {onGoingProjects.map((p) => (
              <div
                key={p.id}
                className={`p-4 border rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.05)] space-y-3  ${
                  dark
                    ? "bg-[#252525] border-gray-500 hover:bg-[#2A2A2A]"
                    : "bg-white border-gray-100 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-full rounded-full h-1.5 ${
                      dark ? "bg-gray-700" : "bg-gray-200"
                    } `}
                  >
                    <div
                      className="h-1.5 rounded-full bg-[#c9ff4b]"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold ">{p.progress}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {p.members.slice(0, 3).map((m, i) => (
                        <img
                          key={i}
                          src={m}
                          alt="member"
                          className="w-6 h-6 rounded-full border-2 border-white"
                        />
                      ))}
                    </div>
                    <Users size={16} className="" />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center  text-xs gap-1">
                      <Calendar size={14} />
                      <span>{p.dueDate}</span>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-[#F5E8D1] text-[#D0A455] rounded-md">
                      Web
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold ">{p.title}</h3>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {p.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 text-[12px] font-semibold rounded-[25px] ${getTagStyles(
                          tag
                        )}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Paperclip size={16} />
                    <MessageCircle size={16} />
                    <Share2 size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Library */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2  rounded-full ${
                  dark ? "bg-[#B4DA00]" : "bg-[#EAF6DA]"
                }`}
              >
                <FileText
                  size={20}
                  className={`${dark ? "text-black" : "text-[#A5C33E]"}`}
                />
              </div>
              <h2 className="text-lg font-semibold ">Resource Library</h2>
            </div>
            <button
              className={`flex items-center text-sm font-semibold  ${
                dark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              <span>View All</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div
            className={` p-6 rounded-3xl border shadow-[0_4px_16px_rgba(0,0,0,0.05)] ${
              dark
                ? "bg-[#252525] border-gray-500 hover:bg-[#2A2A2A]"
                : "bg-white border-gray-100 hover:bg-gray-50"
            }`}
          >
            <div className="space-y-6">
              {resourceLibrary.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 p-2.5  rounded-full ${dark ? "bg-gray-600" : "bg-gray-800"}`}>
                      <FileText size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold  text-sm">
                        {r.title}
                      </h3>
                      <p className="text-xs ">{r.author}</p>
                    </div>
                  </div>
                  <Download
                    size={20}
                    className=" cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button className="bg-[#D8FF4B] p-2 rounded-full shadow-lg">
                <ChevronRight size={24} className="text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="pb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2  rounded-full ${
                  dark ? "bg-[#B4DA00]" : "bg-[#EAF6DA]"
                }`}
              >
                <Zap
                  size={20}
                  className={`${dark ? "text-black" : "text-[#A5C33E]"}`}
                />
              </div>
              <h2
                className={`text-lg font-semibold  ${
                  dark ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Upcoming Events
              </h2>
            </div>
            <button
              className={`flex items-center text-sm font-semibold  ${
                dark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              <span>View All</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="bg-[#F0FFC2] p-3 rounded-2xl flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Discussion About Client Landing Page
                </h3>
                <p className="text-xs text-gray-600">Admin</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-700">Today</p>
                  <p className="text-xs text-gray-500">10:00 AM</p>
                </div>
                <div className="p-1.5 bg-blue-500 rounded-md">
                  <MessageSquare size={20} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-[#F0FFC2] p-3 rounded-2xl flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Backend Integration Sprint
                </h3>
                <p className="text-xs text-gray-600">John Doe</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-700">
                    Tomorrow
                  </p>
                  <p className="text-xs text-gray-500">02:00 PM</p>
                </div>
                <div className="p-1.5 bg-white rounded-md">
                  <Users size={20} className="text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobileDashboard;
