import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import TaskBox from "./TaskBox";
import MembersTable from "./MembersTable";
import ProjectsSection from "./Projects";
import { IoAddCircleOutline, IoAdd } from "react-icons/io5";

const Admin = () => {
  const [active, setActive] = useState("home");
  const [dark, setDark] = useState(true);
  const [assignTask, setAssignTask] = useState(false);

  
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme) {
      setDark(JSON.parse(savedTheme)); 
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("admin-theme", JSON.stringify(dark));
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);
  const toggleTask = () => setAssignTask((prev) => !prev);

  return (
    <div
      className={`w-full min-h-screen  md:p-4 lg:p-5 ${
        dark ? "bg-[#121212] text-white" : "bg-white text-black"
      }`}
    >
      <Header dark={dark} toggleTheme={toggleTheme} />
      <Sidebar dark={dark} active={active} setActive={setActive} />
      <MobileMenu dark={dark} active={active} setActive={setActive} />

      <main className="ml-[1rem] mt-10 flex flex-col gap-5 md:ml-[8rem] md:mt-10 relative">
        {/* Heading */}
        <div className="flex items-center px-3 justify-between text-xl md:text-4xl">
          <h1>Team Members</h1>
          <IoAddCircleOutline
            onClick={toggleTask}
            className="text-3xl md:text-4xl cursor-pointer hidden md:flex"
          />
        </div>

        <IoAdd
          onClick={toggleTask}
          className="fixed bottom-16 right-8 md:hidden text-5xl p-2 rounded-full cursor-pointer border shadow-xl transition-all duration-300 z-50 bg-[#D4FF00] text-black"
          title="Add Task"
        />

        {assignTask && <TaskBox dark={dark} toggleTask={toggleTask} />}

        <select
          className={`w-fit py-1 ml-4 px-2 text-sm rounded-sm ${
            dark
              ? "bg-[#232323] border border-[#373636]"
              : "bg-[#eeeeee] border border-[#a8a8a8]"
          }`}
        >
          <option>24 Hours</option>
          <option>48 Hours</option>
          <option>72 Hours</option>
        </select>

        <MembersTable dark={dark} />
        <ProjectsSection dark={dark} />
      </main>
    </div>
  );
};

export default Admin;
