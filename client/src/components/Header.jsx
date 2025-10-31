import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineLightMode,
  MdOutlineDarkMode,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa6";

const Header = ({ dark, toggleTheme }) => {
  const [notify, setNotify] = useState(false);
  const [userProfile, setUserProfile] = useState(false);

  const toggleNotification = () => setNotify(!notify);
  const toggleProfile = () => setUserProfile(!userProfile);

  const notifications = [
    {
      id: 1,
      title: "New Task Assigned",
      message: "You’ve been assigned a new task: ‘Update homepage UI’.",
      time: "2 mins ago",
      type: "task",
      read: false,
      icon: "📝",
    },
    {
      id: 2,
      title: "Project Deadline Approaching",
      message: "‘Portfolio Website’ project is due in 3 days.",
      time: "15 mins ago",
      type: "project",
      read: false,
      icon: "⏰",
    },
    {
      id: 3,
      title: "Comment Added",
      message: "Ayu commented on your task: ‘Add responsive navbar’.",
      time: "1 hour ago",
      type: "comment",
      read: true,
      icon: "💬",
    },
    {
      id: 4,
      title: "New Member Joined",
      message: "Rahul joined your team for ‘Design Revamp’ project.",
      time: "3 hours ago",
      type: "team",
      read: false,
      icon: "👤",
    },
  ];

  return (
   <header
  className={`sticky top-0 ml-auto w-[94.5vw] z-50 flex bg-[#0B0C0D] items-center p-4 justify-end gap-3 md:gap-4 mb-5
    border border-[#272727]
  `}
>


      {/* Theme toggle */}
      <div
        onClick={toggleTheme}
        className={`w-9 h-9 flex items-center justify-center text-2xl rounded-sm cursor-pointer ${
          dark ? "bg-[#232323] border border-[#373636]" : "bg-[#eeeeee] border"
        }`}
      >
        {dark ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
      </div>

      {/* Notification */}
      
      <div
        onClick={toggleNotification}
        className={`relative w-9 h-9 flex  items-center justify-center text-2xl rounded-sm cursor-pointer transition-all
    ${dark ? "bg-[#232323] border border-[#373636]" : "bg-[#eeeeee] border"}
  `}
      >
        <MdOutlineNotificationsActive />
        {/* Count Badge */}
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#B4DA00] text-black text-[10px] font-semibold px-1.5 py-[1px] rounded-full">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </div>

      {/* Notification Dropdown */}
      {notify && (
        <div
          className={`absolute right-10 md:right-20 top-16 w-[18rem]  max-h-[16rem] rounded-2xl p-3 flex flex-col gap-2 z-50 border-2 shadow-lg overflow-y-auto transition-all duration-200
      ${
        dark ? "bg-[#232323] border-[#656565]" : "bg-[#f1f1f1] border-[#d1d1d1]"
      }
      custom-scrollbar
    `}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <button
              className={`text-xs underline hover:text-[#B4DA00] transition ${
                dark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Mark all as read
            </button>
          </div>

          {/* Notifications List */}
          {notifications.map((note, index) => (
            <div key={note.id}>
              <div
                className={`relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
            ${dark ? "hover:bg-[#2d2d2d]" : "hover:bg-[#e9e9e9]"}
            ${!note.read ? "ring-1 ring-[#B4DA00]/50" : ""}
          `}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-medium shrink-0
              ${
                dark
                  ? "bg-[#1f1f1f] text-[#B4DA00]"
                  : "bg-[#e8e8e8] text-[#8ca700]"
              }
            `}
                >
                  {note.icon}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h4
                    className={`text-sm font-semibold mb-0.5 ${
                      dark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {note.title}
                  </h4>
                  <p
                    className={`text-xs leading-snug ${
                      dark ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {note.message}
                  </p>
                  <div className="flex justify-between items-center mt-1.5">
                    <span
                      className={`text-[11px] ${
                        dark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {note.time}
                    </span>
                    {!note.read && (
                      <span className="w-2 h-2 rounded-full bg-[#B4DA00] animate-pulse"></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              {index !== notifications.length - 1 && (
                <div
                  className={`h-[1px] my-2 ${
                    dark ? "bg-[#333]" : "bg-gray-300/60"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Avatar */}
      <div onClick={toggleProfile} className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-[#B4DA00]"></div>
        <span
          className={` font-medium hidden md:flex ${
            dark ? "text-gray-200" : "text-gray-800"
          }`}
        >
          John Doe
        </span>
        <IoIosArrowDown
          onClick={toggleProfile}
          size={16}
          className="text-gray-400 cursor-pointer hidden md:flex"
        />
      </div>

      {userProfile && (
        <div
          className={`absolute right-2 top-14 w-[17rem] rounded-2xl p-4 flex flex-col gap-3 z-10 border shadow-lg transition-all duration-200 ${
            dark
              ? "bg-[#232323] border-[#373636] text-white"
              : "bg-[#f9f9f9] border-[#d6d6d6] text-black"
          }`}
        >
          {/* Profile header */}
          <div className="flex items-center gap-3 border-b pb-3">
            <img
              src="https://ui-avatars.com/api/?name=Aayushi&background=random"
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h4 className="text-lg font-semibold">Aayushi</h4>
              <p
                className={`text-sm ${
                  dark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Creative Developer
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2 mt-2">
            <Link
              to={"/app/userprofile"}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium hover:scale-[1.02] transition-all ${
                dark ? "hover:bg-[#333]" : "hover:bg-[#e6e6e6]"
              }`}
            >
              View Profile
              <FaArrowRight />
            </Link>
            <button
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium hover:scale-[1.02] transition-all ${
                dark ? "hover:bg-[#333]" : "hover:bg-[#e6e6e6]"
              }`}
            >
              Settings
              <FaArrowRight />
            </button>
            <button
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium hover:scale-[1.02] transition-all ${
                dark ? "hover:bg-[#333]" : "hover:bg-[#e6e6e6]"
              }`}
            >
              Notifications
              <FaArrowRight />
            </button>
          </div>

          {/* Logout */}
          <button
            className={`mt-3 w-full py-2 text-center rounded-xl font-semibold transition-all ${
              dark
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-red-400 hover:bg-red-500 text-white"
            }`}
          >
            Log Out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
