import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import RoleIndicator from "./RoleIndicator";
import AddMemberButton from "./AddMemberButton";
import { RiMore2Line, RiDeleteBinLine } from "react-icons/ri";

export default function TeamMembersCard({ allMembers: initialMembers }) {
  const [members, setMembers] = useState(initialMembers || []);
  const [menuOpenFor, setMenuOpenFor] = useState(null);

  const currentUserRole = "admin";
  const canManageMembers =
    currentUserRole === "admin" || currentUserRole === "sublead";

  const handleAddMember = (newMember) => {
    setMembers((prev) => [...prev, newMember]);
  };

  const handleRemoveMember = (memberName) => {
    setMembers((prev) => prev.filter((member) => member.name !== memberName));
    setMenuOpenFor(null);
  };

  const toggleMenu = (memberName) => {
    setMenuOpenFor((prev) => (prev === memberName ? null : memberName));
  };

  return (
    <div className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl p-5 w-full">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <h2 className="text-base font-semibold">Team Members</h2>
        <AddMemberButton onAddMember={handleAddMember} currentMembers={members} />
      </div>

      {/* Responsive members grid */}
      <div className="flex flex-wrap gap-3 mb-5">
        {members.map((member, index) => (
          <div
            key={index}
            className="relative flex items-center justify-between bg-[#1e1e1e] rounded-lg px-3 py-2 min-w-[160px] sm:min-w-[180px] flex-grow sm:flex-grow-0"
          >
            <div className="flex items-center space-x-2 overflow-hidden">
              <FaUserCircle className="w-6 h-6 text-gray-500 flex-shrink-0" />
              <span className="text-gray-200 text-[12px] sm:text-[14px] whitespace-nowrap">
                {member.name}
              </span>
              <RoleIndicator role={member.role} />
            </div>

            {canManageMembers && (
              <button
                onClick={() => toggleMenu(member.name)}
                className="text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-gray-700 flex-shrink-0"
              >
                <RiMore2Line className="w-3.5 h-3.5" />
              </button>
            )}

            {menuOpenFor === member.name && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-[#1f2022] border border-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleRemoveMember(member.name)}
                  className="w-full flex items-center space-x-2 px-3 py-1 text-[11px] text-red-400 hover:bg-red-900/50"
                >
                  <RiDeleteBinLine className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend (responsive) */}
      <div className="flex flex-wrap justify-end items-center gap-3 sm:gap-6 text-gray-300 mt-3">
        <div className="flex items-center space-x-1.5">
          <BsDot className="w-6 h-6 scale-[1.6] text-pink-500" />
          <span className="text-[12px] font-medium">Team Lead</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <BsDot className="w-6 h-6 scale-[1.6] text-yellow-500" />
          <span className="text-[12px] font-medium">Team Sub-Lead</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <BsDot className="w-6 h-6 scale-[1.6] text-gray-400" />
          <span className="text-[12px] font-medium">Members</span>
        </div>
      </div>
    </div>
  );
}
