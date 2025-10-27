import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineLightMode,
  MdOutlineDarkMode,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";

const Header = ({ dark, toggleTheme }) => {
  const [notify, setNotify] = useState(false);
  const [userProfile, setUserProfile] = useState(false);

  const toggleNotification = () => setNotify(!notify);
  const toggleProfile = () => setUserProfile(!userProfile);

  return (
    <header className="flex items-center p-3 justify-end gap-3 md:gap-4 mb-10 relative">
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
        className={`w-9 h-9 hidden md:flex items-center justify-center text-2xl rounded-sm cursor-pointer ${
          dark ? "bg-[#232323] border border-[#373636]" : "bg-[#eeeeee] border"
        }`}
      >
        <MdOutlineNotificationsActive />
      </div>

      {notify && (
        <div
          className={`absolute right-20 top-14 w-[17rem] h-[12rem] rounded-2xl p-3 flex flex-col gap-2 z-10 border ${
            dark
              ? "bg-[#232323] border-[#373636]"
              : "bg-[#eeeeee] border-[#a8a8a8]"
          }`}
        >
          <div className="w-full h-1/3 bg-green-500 rounded-xl"></div>
          <div className="w-full h-1/3 bg-green-500 rounded-xl"></div>
          <div className="w-full h-1/3 bg-green-500 rounded-xl"></div>
        </div>
      )}

      {/* Avatar */}
      <div
        onClick={toggleProfile}
        className="w-9 h-9 bg-green-500 rounded-full cursor-pointer lg:w-10 lg:h-10"
      ></div>

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
      <Link to={"/userprofile"}
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
