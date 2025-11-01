// ------------------------------------
// React & Imports
// ------------------------------------
import React, { useState } from "react";
import { Star, Calendar, Users, User, FileText, Trash2, CheckSquare, Square, Search } from "lucide-react";
import Tag from "./Tag";
import DetailRow from "./DetailRow";
import { rolePermissions } from "../utils/rolePermissions";

// ------------------------------------
// Dashboard Component
// ------------------------------------
const Dashboard = ({ data }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [search, setSearch] = useState("");

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    try {
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return "Invalid Date";
    }
  };

  const shortDesc =
    data.description.length > 150
      ? data.description.slice(0, 150) + "..."
      : data.description;

  // Filter members dynamically as you type & exclude leads
  const filteredMembers = data.teamMembers.filter(
    (m) =>
      !m.role?.toLowerCase().includes("lead") &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full md:w-1/2 space-y-8 relative top-[-20px]">
      {/* ---------- Section Header ---------- */}
      <div className="flex items-center space-x-3">
        <Star className="w-8 h-8 text-zinc-200" />
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
      </div>

      {/* ---------- Project Tags ---------- */}
      <div className="flex items-center space-x-3">
        {data.tags.map((tag, index) => (
          <Tag
            key={index}
            className={
              index === 0
                ? "bg-green-700/60 text-green-200"
                : index === 1
                ? "bg-pink-700/60 text-pink-200"
                : "bg-zinc-200 text-zinc-900 font-semibold"
            }
          >
            {tag}
          </Tag>
        ))}
      </div>

      {/* ---------- Project Details ---------- */}
      <div className="space-y-8">
        <div className="space-y-2">
          {/* Project Status */}
          <DetailRow icon={Star} label="Status">
            <span className="bg-green-500/20 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
              {data.status}
            </span>
          </DetailRow>

          {/* Project Due Date */}
          <DetailRow icon={Calendar} label="Due Date">
            {formatDate(data.endDate)}
          </DetailRow>

          {/* Project Team Members */}
          <DetailRow icon={Users} label="Members">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-3">
                {data.teamMembers.slice(0, 3).map((member) => (
                  <img
                    key={member.id}
                    className="w-8 h-8 rounded-full border-2 border-[#111111]"
                    src={`https://placehold.co/32x32/c084fc/ffffff?text=${member.name.charAt(0)}`}
                    alt={member.name}
                  />
                ))}
              </div>
              {data.teamMembers.length > 3 && (
                <button
                  onClick={() => setShowAllMembers(true)}
                  className="text-xs text-zinc-400 hover:text-white hover:underline"
                >
                  + {data.teamMembers.length - 3} more
                </button>
              )}
            </div>
          </DetailRow>

          {/* Assignee Name */}
          <DetailRow icon={User} label="Lead">
            <span className="bg-zinc-800 px-3 py-1 rounded-md text-sm text-zinc-300">
              {data.assignee}
            </span>
          </DetailRow>

          {/* Project Description */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-4">
              <FileText className="w-5 h-5 text-zinc-400 flex-shrink-0" />
              <span className="text-sm text-zinc-400 font-medium w-28 flex-shrink-0">
                Description
              </span>
            </div>

            <div className="bg-[#262626] p-4 rounded-lg text-sm text-zinc-300 border border-zinc-800">
              <p>
                {shortDesc}
                {data.description.length > 150 && (
                  <button
                    onClick={() => setShowFullDesc(true)}
                    className="text-blue-400 ml-2 hover:underline"
                  >
                    View More
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ---------- Task Section ---------- */}
        <div className="mt-10">
          <div className="flex items-center mb-6">
            <button className="relative px-4 py-2 text-sm font-medium text-white">
              Your Tasks
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
            </button>
            <button className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white">
              All Tasks
            </button>
          </div>

          <div className="space-y-4">
            {data.tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3">
                {task.completed ? (
                  <CheckSquare className="w-5 h-5 text-purple-500" />
                ) : (
                  <Square className="w-5 h-5 text-zinc-600" />
                )}
                <span
                  className={`text-sm ${
                    task.completed ? "text-zinc-500" : "text-zinc-200"
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Modal for Full Description ---------- */}
      {showFullDesc && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] p-6 rounded-xl max-w-lg w-full border border-zinc-800 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-white">{data.name}</h2>
            <p className="text-gray-300 mb-6">{data.description}</p>
            <button
              onClick={() => setShowFullDesc(false)}
              className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 text-white text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ---------- Modal for All Members (search + filter + no scrollbar) ---------- */}
      {showAllMembers && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] p-6 rounded-xl max-w-md w-full border border-zinc-800 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-white">Project Members</h2>

            {/* Search Bar */}
            <div className="flex items-center bg-[#2a2a2a] rounded-lg px-3 py-2 mb-4">
              <Search className="w-4 h-4 text-zinc-400 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="bg-transparent w-full text-sm text-zinc-300 outline-none placeholder:text-zinc-500"
              />
            </div>

            {/* Member List */}
            <div
              className="space-y-3 max-h-64 overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>

              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between space-x-3 p-2 rounded-lg hover:bg-[#2a2a2a]"
                  >
                    <div className="flex items-center gap-3 h-full">
                      <img
                        className="w-8 h-8 rounded-full border border-zinc-700"
                        src={`https://placehold.co/32x32/c084fc/ffffff?text=${member.name.charAt(0)}`}
                        alt={member.name}
                      />
                      <span className="text-sm h-fit text-zinc-300">{member.name}</span>
                    </div>
                    {rolePermissions.admin.canDeleteMembers && < Trash2 
                      onClick={()=>{}}
                    size={15}></Trash2>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500 text-center">No members found</p>
              )}
            </div>

            <button
              onClick={() => setShowAllMembers(false)}
              className="bg-blue-500 px-4 py-2 mt-5 rounded-lg hover:bg-blue-600 text-white text-sm w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ------------------------------------
// Export Component
// ------------------------------------
export default Dashboard;
