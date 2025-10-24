import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import membersData from "./data";

const roles = ["Designer", "Frontend", "Backend", "Admin", "Strategist"];

const MembersTable = ({ dark }) => {
  const [members, setMembers] = useState(membersData);
  const [hoveredMember, setHoveredMember] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleRoleClick = (index, role) => {
    const updatedMembers = [...members];
    updatedMembers[index].role = role;
    setMembers(updatedMembers);
    setHoveredMember(null); 
  };

  const handleNameClick = (member) => {
    console.log(member.name)
    navigate(`/member/${member.name}`, { state: { member } });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setHoveredMember(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <table
      className={`w-[95%] border-collapse ${
        dark ? "text-[#a6a6a6]" : "text-[#1e1e1e]"
      }`}
    >
      <thead>
        <tr
          className={`${
            dark ? "border-b border-[#262626]" : "border-b border-[#a8a8a8]"
          }`}
        >
          <th className="p-2 md:p-3 text-center">Name</th>
          <th className="p-2 md:p-3 text-center">Role</th>
          <th className="p-2 md:p-3 text-center hidden md:table-cell">
            Deadline
          </th>
          <th className="p-2 md:p-3 text-center">Task Assigned</th>
          <th className="p-2 md:p-3 text-center hidden md:table-cell">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, i) => (
          <tr
            key={i}
            className={`${
              dark
                ? "border-b border-[#262626] hover:bg-[#232323]"
                : "border-b border-[#a8a8a8] hover:bg-[#e1e1e1]"
            } transition relative`}
          >
            <td
              className="p-3 text-center cursor-pointer hover:underline"
              onClick={() => handleNameClick(member)}
            >
              {member.name}
            </td>

            <td
              className="p-3 text-center relative"
              onClick={() =>
                setHoveredMember((prev) => (prev === i ? null : i))
              }
            >
              <span
                className={`inline-block px-3 py-1 rounded-full text-black cursor-pointer ${
                  member.role.toLowerCase() === "designer"
                    ? "bg-purple-300 text-purple-900"
                    : member.role.toLowerCase() === "backend"
                    ? "bg-green-200 text-green-900"
                    : member.role.toLowerCase() === "strategist"
                    ? "bg-yellow-200 text-yellow-900"
                    : "bg-pink-200 text-red-800"
                }`}
              >
                {member.role}
              </span>

              {/* Hover box */}
              {hoveredMember === i && (
                <div
                  ref={dropdownRef}
                  className={`absolute top-[45%] left-[11.5rem] scale-75 md:top-[90%] md:left-[12rem] md:scale-95 lg:left-[17rem] lg:scale-100 transform -translate-x-1/2 -mt-10
                   
                 rounded-xl shadow-xl p-2 z-10 w-[10rem] text-sm ${
                   dark
                     ? "bg-[#1e1e1e] border border-[#3f3f3f] text-white"
                     : "bg-white border border-gray-400 text-black"
                 }`}
                >
                  <div className="text-center mb-2 font-medium">
                    Select an option
                  </div>

                  <div className="flex flex-col gap-2">
                    {roles.map((roleOption) => {
                      const roleColors = {
                        Designer: "bg-purple-300 text-purple-900",
                        Frontend: "bg-pink-200 text-red-800",
                        Backend: "bg-green-200 text-green-900",
                        Strategist: "bg-yellow-200 text-yellow-900",
                        Admin: "bg-gray-500 text-white",
                      };

                      return (
                        <div
                          key={roleOption}
                          onClick={() => handleRoleClick(i, roleOption)}
                          className={`flex items-center justify-start  gap-1 px-2 py-1 rounded-full 
                          cursor-pointer hover:scale-[1.02] transition-transform 
                          ${
                            roleColors[roleOption] ||
                            "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <span className="text-lg text-gray-700 dark:text-gray-300">
                            ⋮⋮
                          </span>
                          <span className="flex-1 text-center font-semibold">
                            {roleOption}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </td>

            <td className="p-3 text-center hidden md:table-cell">
              {member.deadline}
            </td>
            <td className="p-3 text-center">{member.task}</td>
            <td className="p-3 text-center hidden md:table-cell">
              <span
                className={`inline-block px-3 py-1 rounded-full text-black ${
                  member.status.toLowerCase() === "pending"
                    ? "bg-red-300 text-red-900"
                    : member.status.toLowerCase() === "completed"
                    ? "bg-green-300 text-green-900"
                    : member.status.toLowerCase() === "in progress"
                    ? "bg-yellow-300 text-yellow-900"
                    : ""
                }`}
              >
                {member.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MembersTable;
