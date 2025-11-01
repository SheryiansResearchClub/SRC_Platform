import React from "react";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { GoProjectSymlink } from "react-icons/go";
import { SlCalender } from "react-icons/sl";
import { LuUser, LuSettings } from "react-icons/lu";
import { FaTasks } from "react-icons/fa";

const Sidebar = ({ dark, active, setActive }) => {
  const topLinks = [
    { key: "home", icon: <FiHome />, path: "/app", title: "Home" },
    { key: "projects", icon: <GoProjectSymlink />, path: "/app/projects", title: "Projects" },
    { key: "calendar", icon: <SlCalender />, path: "/app/calendar", title: "Calendar" },
    { key: "tasks", icon: <FaTasks />, path: "/app/tasks", title: "Tasks" },
    { key: "user", icon: <LuUser />, path: "/app/userprofile", title: "User" },
  ];

  const bottomLink = {
    key: "settings",
    icon: <LuSettings />,
    path: "/app/settings",
    title: "Settings",
  };

  return (
    <aside className="absolute left-3 top-5 md:fixed md:left-5 md:top-5 flex flex-col justify-between h-[95vh]">
      {/* Top Section */}
      <div className="flex flex-col gap-10">
        {/* Logo */}
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-sm">
          <img
            className="object-center cursor-pointer"
            src="https://ik.imagekit.io/sheryians/SRC%20Assets/images/icons/logo_i6Fg0Ut01z.svg"
            alt="logo"
          />
        </div>

        {/* Divider line */}
        <div className="hidden md:flex left-20 top-0 w-[1px] h-full bg-[#373636] fixed"></div>

        {/* Navigation (Top Links) */}
        <nav className="flex-col gap-6 hidden md:flex">
          {topLinks.map(({ key, icon, path, title }) => (
            <Link
              key={key}
              to={path}
              onClick={() => setActive(key)}
              className={`relative group w-10 h-10 rounded-sm flex items-center justify-center text-2xl cursor-pointer transition-all
                ${dark ? "border border-[#373636] hover:bg-[#1a1a1a]" : "border border-[#a8a8a8] hover:bg-[#dcdcdc]"}
                ${active === key ? "ring-2 ring-[#B4DA00]" : ""}
              `}
            >
              {/* Icon */}
              <span>{icon}</span>

              {/* Tooltip */}
              <span
                className={`absolute left-12 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 
                ${dark ? "bg-[#1f1f1f] text-white border border-[#373636]" : "bg-white text-black border border-gray-300"}
                `}
              >
                {title}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Settings Link */}
      <div className="hidden md:flex">
        <Link
          to={bottomLink.path}
          onClick={() => setActive(bottomLink.key)}
          className={`relative group w-10 h-10 rounded-sm flex items-center justify-center text-2xl cursor-pointer transition-all
            ${dark ? "border border-[#373636] hover:bg-[#1a1a1a]" : "border border-[#a8a8a8] hover:bg-[#dcdcdc]"}
            ${active === bottomLink.key ? "ring-2 ring-[#B4DA00]" : ""}
          `}
        >
          <span>{bottomLink.icon}</span>
          <span
            className={`absolute left-12 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 
            ${dark ? "bg-[#1f1f1f] text-white border border-[#373636]" : "bg-white text-black border border-gray-300"}
            `}
          >
            {bottomLink.title}
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
