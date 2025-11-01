import React, { useState, useEffect } from "react";
import ThemeContext from "@/context/ThemeContext";
import TaskBox from "./TaskBox";
import TasksTable from "./TasksTable";
import { IoAddCircleOutline, IoAdd } from "react-icons/io5";
import { useContext } from "react";

const Tasks = () => {
  const [active, setActive] = useState("home");
  const { dark } = useContext(ThemeContext);
  const [assignTask, setAssignTask] = useState(false);

  const toggleTask = () => setAssignTask((prev) => !prev);

  return (
    <div
      className={`w-full min-h-screen   ${
        dark ? "bg-[#121212] text-white" : "bg-white text-black"
      }`}
    >

      <main className=" flex flex-col gap-10  relative">
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

        <TasksTable dark={dark} />
        
      </main>
    </div>
  );
};

export default Tasks;
