import React from "react";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { GoProjectSymlink } from "react-icons/go";
import { SlCalender } from "react-icons/sl";

const Sidebar = ({ dark, active, setActive }) => (
  <aside className="absolute left-3 top-3 md:fixed md:left-5 md:top-10 flex flex-col gap-10">
    <div className="w-9 h-9 md:w-10 md:h-10 rounded-sm">
      <img
        className="object-center cursor-pointer"
        src="https://ik.imagekit.io/sheryians/SRC%20Assets/images/icons/logo_i6Fg0Ut01z.svg"
        alt="logo"
      />
    </div>

    <div className="hidden md:flex left-20 top-0 w-[1px] h-full bg-[#373636] fixed"></div>

    <nav className="flex-col gap-5 hidden md:flex">
      {[
        { key: "home", icon: <FiHome />, path: "/admin" },
        { key: "projects", icon: <GoProjectSymlink />, path: "/admin/projects" },
        { key: "calendar", icon: <SlCalender />, path: "/admin/calendar" },
      ].map(({ key, icon, path }) => (
        <Link
          key={key}
          to={path}
          onClick={() => setActive(key)}
          className={`w-10 h-10 rounded-sm flex items-center justify-center text-2xl cursor-pointer transition-all ${
            dark
              ? "border border-[#373636] hover:bg-[#1a1a1a]"
              : "border border-[#a8a8a8] hover:bg-[#dcdcdc]"
          } ${
            active === key
              ? dark
                ? "bg-[#232323] ring-2 ring-green-500"
                : "bg-[#dcdcdc] ring-2 ring-green-500"
              : ""
          }`}
        >
          {icon}
        </Link>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
