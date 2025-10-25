import React from "react";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { GoProjectSymlink } from "react-icons/go";
import { SlCalender } from "react-icons/sl";

const MobileMenu = ({ dark, active, setActive }) => (
  <div
    className={`w-full h-12 border-t fixed bottom-0 z-50 flex items-center justify-evenly md:hidden ${
      dark ? "bg-black border-[#232323]" : "bg-white border-[#a8a8a8]"
    }`}
  >
    {[
      { key: "home", icon: <FiHome />, path: "/admin" },
      { key: "projects", icon: <GoProjectSymlink />, path:"/projects" },
      { key: "calendar", icon: <SlCalender />, path:"./calender" },
    ].map(({ key, icon, path }) => (
      
        <Link
          key={key}
          to={path}
          onClick={() => setActive(key)}
          className={`w-8 h-8 flex items-center justify-center text-2xl cursor-pointer ${
            dark ? "text-[#a8a8a8]" : "text-[#232323]"
          } ${active === key ? (dark ? "text-white" : "text-[#343434]") : ""}`}
        >
          {icon}
        </Link>
      
    ))}
  </div>
);

export default MobileMenu;
