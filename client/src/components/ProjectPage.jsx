import React, { useState, useContext } from "react";
import ThemeContext from "@/context/ThemeContext";
import { Radio, ChevronDown } from "lucide-react";

const ProjectPage = () => {
  const { dark } = useContext(ThemeContext);

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
      status: "Ongoing",
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
      status: "Completed",
      title: "Designathon",
      tags: ["Hackathon", "UI Tool", "Completed"],
      users: "700K",
      contributors: [
        "https://i.pravatar.cc/40?img=11",
        "https://i.pravatar.cc/40?img=12",
        "https://i.pravatar.cc/40?img=13",
      ],
    },
    {
      status: "Todo",
      title: "New Launch",
      tags: ["Planned", "Upcoming"],
      users: "—",
      contributors: [],
    },
  ];

  // Filter dropdown states
  const statusOptions = ["All", "Ongoing", "Completed", "Todo"];
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Filter projects based on dropdown selection
  const filteredProjects =
    selectedStatus === "All"
      ? projects
      : projects.filter((p) => p.status === selectedStatus);

  // Group filtered projects by category
  const categorized = {
    Ongoing: filteredProjects.filter((p) => p.status === "Ongoing"),
    Completed: filteredProjects.filter((p) => p.status === "Completed"),
    Todo: filteredProjects.filter((p) => p.status === "Todo"),
  };

  return (
    <div
      className={`w-full min-h-screen ${dark ? "bg-[#121212] text-gray-200" : "bg-white text-gray-800"
        }`}
    >
      <main className="flex bg-red-500 flex-col justify-center gap-8 px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xl md:text-3xl font-bold">
          <h1>All Projects</h1>

          {/* Filter Dropdown */}
          <div className="relative text-base font-normal">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className={`flex items-center justify-between w-40 py-2 px-4 rounded-lg font-semibold ${dark
                  ? "bg-[#B4DA00] text-gray-800"
                  : "bg-[#B4DA00]/20 text-gray-800"
                }`}
            >
              <span>{selectedStatus}</span>
              <ChevronDown
                size={16}
                className={`${isStatusOpen ? "rotate-180" : ""} transition`}
              />
            </button>

            {isStatusOpen && (
              <div
                className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg py-2 z-10 ${dark ? "bg-[#2c2c2c]" : "bg-white border border-gray-200"
                  }`}
              >
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedStatus(option);
                      setIsStatusOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${dark
                        ? "text-gray-200 hover:bg-[#1f1f1f]"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categorized project sections */}
        {Object.entries(categorized).map(([category, items]) =>
          items.length > 0 ? (
            <section key={category}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${dark ? "bg-[#B4DA00]" : "bg-[#B4DA00]/20"
                    }`}
                >
                  <Radio
                    size={16}
                    className={`${dark ? "text-black" : "text-[#B4DA00]"}`}
                  />
                </div>
                <h2 className="text-2xl font-semibold">{category} Projects</h2>
              </div>

              <div className="flex flex-wrap gap-6 mt-2">
                {items.map((p, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl overflow-hidden w-full max-w-xs p-5 border transition-colors duration-200 ${dark
                        ? "bg-[#1f1f1f] border-[#2c2c2c] text-white hover:bg-[#191919]"
                        : "bg-[#f7f7f7] border-[#d0d0d0] text-black hover:bg-[#eaeaea]"
                      }`}
                  >
                    {/* Project Image */}
                    <div className="w-full h-44 bg-[#3a3a3a] rounded-lg mb-4"></div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`h-3 w-3 rounded-full ${p.status === "Ongoing"
                            ? "bg-green-500"
                            : p.status === "Completed"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                      ></span>
                      <p
                        className={`text-sm font-medium ${p.status === "Ongoing"
                            ? "text-green-500"
                            : p.status === "Completed"
                              ? "text-blue-500"
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
                          className={`text-xs px-3 py-1 rounded-full border ${dark
                              ? "border-[#3a3a3a] text-[#cfcfcf]"
                              : "border-[#bcbcbc] text-[#333]"
                            }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Contributors */}
                    {p.contributors.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm mb-2 text-gray-400">
                          Contributors
                        </p>
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
                    )}

                    {/* Stats */}
                    <div className="flex justify-between text-sm mt-2">
                      <p className="font-medium">
                        <span className="text-lg font-semibold">{p.users}</span>{" "}
                        users
                      </p>
                      <p className="font-medium">Latest update • 2d ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null
        )}
      </main>
    </div>
  );
};

export default ProjectPage;
