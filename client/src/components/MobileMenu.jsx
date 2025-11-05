import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// We'll load the icons from a CDN to fix the import error.

// Helper hook to load external stylesheet
const useExternalStylesheet = (url) => {
  useEffect(() => {
    // Check if the link already exists
    if (document.querySelector(`link[href="${url}"]`)) {
      return;
    }

    const link = document.createElement("link");
    link.href = url;
    link.rel = "stylesheet";

    document.head.appendChild(link);

    // Optional cleanup function
    return () => {
      // We could remove the link on component unmount,
      // but it's often better to leave it in case other components need it.
    };
  }, [url]);
};


const Sidebar = () => {
  // Load the RemixIcon stylesheet from a CDN
  useExternalStylesheet("https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css");
  
  const location = useLocation();

  const topLinks = [
    { key: "home", icon: <i className="ri-home-line"></i>, path: "/app", title: "Home" },
    { key: "projects", icon: <i className="ri-grid-fill"></i>, path: "/app/projects", title: "Projects" },
    { key: "mytasks", icon: <i className="ri-task-line"></i>, path: "/app/taskdetails", title: "My Tasks" },
    { key: "tasks", icon: <i className="ri-team-fill"></i>, path: "/app/tasks", title: "Team Members" },
    {
      key: "teams",
      icon: <i className="ri-user-community-line"></i>,
      path: "/app/teams",
      title: "All Teams",
    },
    { key: "user", icon: <i className="ri-user-line"></i>, path: "/app/userprofile", title: "User" },
  ];

  // --- Settings Link Removed ---

  return (
    // RESPONSIVE MAIN CONTAINER:
    // Removed justify-between as there is only one child group now.
    <div className="fixed top-0 left-0 z-50 flex flex-row items-center w-full h-auto p-4 bg-[#181818] border-b border-[#272727] md:flex-col md:h-screen md:w-[4.5vw] md:border-r md:border-b-0 md:py-9 md:px-0">
      
      {/* Top Section (Logo + Nav) */}
      {/* RESPONSIVE TOP/LEFT GROUP:
          Mobile: Added justify-between to space out Logo and Nav Icons. Added w-full.
          md: flex-col to stack them vertically. */}
      <div className="flex flex-row items-center justify-between w-full gap-4 md:flex-col md:items-center">
        {/* Logo */}
        {/* RESPONSIVE LOGO MARGIN:
            Mobile: No bottom margin.
            md: Your original mb-12. */}
        <div className="mb-0 md:mb-12">
          <Link to="/app">
            <img
              src="/src/assets/images/logow.png"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
          </Link>
        </div>

        {/* Navigation Icons */}
        {/* RESPONSIVE NAV LINKS:
            Mobile: flex-row with smaller gap.
            md: flex-col with original gap. */}
        <div className="flex flex-row gap-4 md:flex-col md:gap-10">
          {topLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              className={`text-2xl transition-colors ${
                location.pathname === link.path
                  ? "text-white"
                  // Adjusted for better contrast on dark background
                  : "text-gray-400 hover:text-gray-100" 
              }`}
              title={link.title}
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* --- Bottom Section (Settings) Removed --- */}
    </div>
  );
};

export default Sidebar;

