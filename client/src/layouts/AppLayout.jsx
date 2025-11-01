import React, { useState, useEffect, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ThemeContext from "@/context/ThemeContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileMenu from "../components/MobileMenu";

const AppLayout = () => {
  const { dark, toggleTheme } = useContext(ThemeContext);
  const [active, setActive] = useState("home");
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("admin-theme", dark);
  }, [dark]);

  useEffect(() => {
    if (location.pathname.includes("projects")) setActive("projects");
    else if (location.pathname.includes("members")) setActive("members");
    else if (location.pathname.includes("calendar")) setActive("calendar");
    else if (location.pathname.includes("tasks")) setActive("tasks");
    else if (location.pathname.includes("user")) setActive("user");


    else setActive("home");
  }, [location]);

  return (
    <div
      className={`font-sans ${
        dark ? "bg-[#0B0D0E] text-white" : "bg-white text-black"
      } min-h-screen`}
    >
      {/* Shared layout components */}
      <Header dark={dark} toggleTheme={toggleTheme} />
      <Sidebar dark={dark} active={active} setActive={setActive} />
      <MobileMenu dark={dark} active={active} setActive={setActive} />

      {/* Page-specific content */}
      <main className="pt-7 md:pl-28 pb-16 px-4">
        <Outlet context={{ dark, toggleTheme, active, setActive }} />
      </main>
    </div>
  );
};

export default AppLayout;
