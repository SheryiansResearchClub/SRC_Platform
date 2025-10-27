import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDropright } from "react-icons/io";

const ProjectsSection = ({ dark }) => (
  <div className="w-full mt-16 mb-10 p-3">
    <div className="flex items-center px-3 justify-between text-xl md:text-4xl">
      <h1>All Projects</h1>
      <Link to={"/admin/projects"}>
        <IoIosArrowDropright className="cursor-pointer text-3xl md:text-4xl" />
      </Link>
    </div>

    <div className="flex items-center flex-wrap justify-start gap-3 mt-5 md:gap-5 md:mt-7">
      <div
        className={`w-[11rem] h-[7rem] p-3 md:w-[15rem] md:h-[10rem] md:p-4 rounded-2xl flex flex-col items-start justify-center gap-2 md:gap-4 transition-all ${
          dark
            ? "bg-[#232323] border border-[#373737] hover:bg-[#1a1a1a]"
            : "bg-[#eeeeee] border border-[#a8a8a8] hover:bg-[#d8d8d8]"
        }`}
      >
        <h1 className="text-md md:text-xl">Frontend App</h1>
        <p className="text-sm px-1.5 py-0.4 md:px-2 md:py-0.5 rounded-full bg-[#9f4242] text-[#e0e0e0]">
          35%
        </p>
        <h3 className="text-sm md:text-xl">All members do meet.</h3>
      </div>
    </div>
  </div>
);

export default ProjectsSection;
