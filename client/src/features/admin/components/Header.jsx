import React, { useState } from "react";
import {
  MdOutlineLightMode,
  MdOutlineDarkMode,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

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
          className={`absolute right-2 top-14 w-[15rem] h-[17rem] rounded-2xl p-3 flex flex-col gap-2 z-10 border ${
            dark
              ? "bg-[#232323] border-[#373636]"
              : "bg-[#eeeeee] border-[#a8a8a8]"
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xl">Hello Aayushi</h4>
            <IoAddCircleOutline
              onClick={toggleProfile}
              className="rotate-45 text-3xl cursor-pointer"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
