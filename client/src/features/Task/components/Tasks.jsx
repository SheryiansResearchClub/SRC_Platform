import React, { useState, useEffect } from "react";
import ThemeContext from "@/context/ThemeContext";

import MembersTable from "./MembersTable";

import { useContext } from "react";

const Tasks = () => {
  const { dark } = useContext(ThemeContext);

  return (
    <div
      className={`w-full min-h-screen   ${
        dark ? "bg-[#0B0D0E] text-white" : "bg-white text-black"
      }`}
    >
      <main className=" flex flex-col gap-10  relative">
        {/* Heading */}
        <div className="flex items-center px-3 justify-between text-xl md:text-4xl">
          <h1>Team Members</h1>
        </div>

        <MembersTable dark={dark} />
      </main>
    </div>
  );
};

export default Tasks;
