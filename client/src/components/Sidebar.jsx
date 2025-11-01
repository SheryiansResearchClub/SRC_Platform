import React from "react";
import { Link, useLocation } from "react-router-dom";
import "remixicon/fonts/remixicon.css"; // Remix Icons import

const Sidebar = () => {
  const location = useLocation();

  const topLinks = [
    { key: "home", icon: <i className="ri-home-line"></i>, path: "/app", title: "Home" },
    { key: "projects", icon: <i className="ri-grid-fill"></i>, path: "/app/projects", title: "Projects" },
    { key: "calendar", icon: <i className="ri-task-line"></i>, path: "/app/calendar", title: "Calendar" },
    { key: "tasks", icon: <i className="ri-team-fill"></i>, path: "/app/tasks", title: "Tasks" },
    { key: "user", icon: <i className="ri-user-line"></i>, path: "/app/userprofile", title: "User" },
  ];

  const bottomLink = {
    key: "settings",
    icon: <i className="ri-settings-3-line"></i>,
    path: "/app/settings",
    title: "Settings",
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-[4.5vw] bg-[#181818] border-r border-[#272727] flex flex-col items-center justify-between py-9">
      {/* Top Section */}
      <div className="flex flex-col items-center w-full">
        {/* Logo */}
        <div className="mb-12">
          <Link to="/app">
            <img
              src="/src/assets/images/logow.png"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
          </Link>
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col gap-10">
          {topLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              className={`text-2xl transition-colors ${
                location.pathname === link.path
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              title={link.title}
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        <Link
          to={bottomLink.path}
          className={`text-2xl transition-colors ${
            location.pathname === bottomLink.path
              ? "text-white"
              : "text-gray-500 hover:text-gray-300"
          }`}
          title={bottomLink.title}
        >
          {bottomLink.icon}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
