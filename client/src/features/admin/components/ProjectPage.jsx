import React, { useState, useEffect } from "react";
import ThemeContext, { ThemeProvider } from "@/context/ThemeContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import { IoAddCircleOutline } from "react-icons/io5";
import { useContext } from "react";

const ProjectPage = () => {
  const [active, setActive] = useState("projects");
 const {dark, toggleTheme} = useContext(ThemeContext)

  // Example project data
  const projects = [
    {
      status: "Ongoing",
      title: "Focus Flow",
      tags: ["Open Source", "Web App", "5★ Rating", "Active"],
      users: "2.3M",
      contributors: [
        "https://i.pravatar.cc/40?img=5",
        "https://i.pravatar.cc/40?img=6",
        "https://i.pravatar.cc/40?img=7",
      ],
    },
    {
      status: "Paused",
      title: "DesignPilot",
      tags: ["Internal", "UI Tool", "Alpha"],
      users: "500K",
      contributors: [
        "https://i.pravatar.cc/40?img=8",
        "https://i.pravatar.cc/40?img=9",
        "https://i.pravatar.cc/40?img=10",
      ],
    },
    {
      status: "Cancelled",
      title: "Designathon",
      tags: ["Internal", "UI Tool", "Alpha"],
      users: "700K",
      contributors: [
        "https://i.pravatar.cc/40?img=8",
        "https://i.pravatar.cc/40?img=9",
        "https://i.pravatar.cc/40?img=10",
      ],
    },
  ];

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
        
        {/* Header */}
        <div className="flex items-center px-3 justify-between text-xl md:text-4xl">
          <h1>All Projects</h1>
          <IoAddCircleOutline className="text-3xl md:text-4xl cursor-pointer" />
        </div>

        {/* dropdown filter */}
        <select
          className={`w-fit py-1 ml-4 px-2 text-sm rounded-sm ${
            dark
              ? "bg-[#232323] border border-[#373636]"
              : "bg-[#eeeeee] border border-[#a8a8a8]"
          }`}
        >
          <option>Todo</option>
          <option>Ongoing</option>
          <option>Completed</option>
        </select>


        {/* Project Cards */}
        <div className="flex flex-wrap gap-6 mt-5">
          {projects.map((p, index) => (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden w-full max-w-xs p-5 border  ${
                dark
                  ? "bg-[#1f1f1f] border-[#2c2c2c] text-white hover:bg-[#191919]"
                  : "bg-[#f7f7f7] border-[#d0d0d0] text-black hover:bg-[#eaeaea]"
              }`}
            >
              {/* Project Image */}
              <div className="w-full h-44 bg-[#3a3a3a] rounded-lg mb-4"></div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`h-3 w-3 rounded-full ${
                    p.status === "Ongoing"
                      ? "bg-green-500"
                      : p.status === "Cancelled"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                ></span>
                <p
                  className={`text-sm font-medium ${
                    p.status === "Ongoing"
                      ? "text-green-500"
                      : p.status === "Cancelled"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {p.status}
                </p>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold mb-3">{p.title}</h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`text-xs px-3 py-1 rounded-full border ${
                      dark
                        ? "border-[#3a3a3a] text-[#cfcfcf]"
                        : "border-[#bcbcbc] text-[#333]"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Contributors */}
              <div className="mb-4">
                <p className="text-sm mb-2 text-gray-400">Contributors</p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {p.contributors.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="contributor"
                        className="w-8 h-8 rounded-full border border-[#333]"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">+5 more</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-sm mt-2">
                <p className="font-medium">
                  <span className="text-lg font-semibold">{p.users}</span> users
                </p>
                <p className="font-medium">Latest update • 2d ago</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProjectPage;
