import React, { useState } from "react";

export default function CreateTeamForm({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    teamName: "",
    lead: "",
    subLeads: [],
    members: [],
  });

  const allMembers = [
    "Riya Infinity",
    "Aarav Patel",
    "Neha Sharma",
    "Vikram Singh",
    "Tanya Verma",
    "Arjun Reddy",
    "Saanvi Gupta",
    "Rohan Mehta",
    "Priya Das",
    "Kabir Khan",
  ];

  const [searchLead, setSearchLead] = useState("");
  const [searchSubLead, setSearchSubLead] = useState("");
  const [searchMember, setSearchMember] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTeam = {
      id: Date.now(),
      name: formData.teamName,
      members: `${1 + formData.subLeads.length + formData.members.length} members`,
      icon: "ri-team-line",
      color: "bg-green-600",
    };

    if (typeof onCreate === "function") onCreate(newTeam);
    onClose();
  };

  const addLead = (name) => {
    setFormData({ ...formData, lead: name });
    setSearchLead("");
  };

  const addSubLead = (name) => {
    if (
      !formData.subLeads.includes(name) &&
      formData.lead !== name &&
      !formData.members.includes(name)
    ) {
      setFormData({
        ...formData,
        subLeads: [...formData.subLeads, name],
      });
    }
    setSearchSubLead("");
  };

  const addMember = (name) => {
    if (
      !formData.members.includes(name) &&
      formData.lead !== name &&
      !formData.subLeads.includes(name)
    ) {
      setFormData({
        ...formData,
        members: [...formData.members, name],
      });
    }
    setSearchMember("");
  };

  const availableLeads = allMembers.filter(
    (m) =>
      !formData.subLeads.includes(m) &&
      !formData.members.includes(m) &&
      m !== formData.lead
  );

  const availableSubLeads = allMembers.filter(
    (m) =>
      m !== formData.lead &&
      !formData.members.includes(m) &&
      !formData.subLeads.includes(m)
  );

  const availableMembers = allMembers.filter(
    (m) =>
      m !== formData.lead &&
      !formData.subLeads.includes(m) &&
      !formData.members.includes(m)
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-[#111] p-6 rounded-xl w-full max-w-lg shadow-lg text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-white text-lg mb-5 font-semibold">Create New Team</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Team Name */}
          <div>
            <label
              htmlFor="teamName"
              className="text-gray-300 text-sm mb-1 block"
            >
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              placeholder="Enter team name"
              value={formData.teamName}
              onChange={(e) =>
                setFormData({ ...formData, teamName: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white border border-[#333] focus:outline-none focus:border-[#B4DA00]"
              required
            />
          </div>

          {/* Team Lead */}
          <div className="relative">
            <label
              htmlFor="teamLead"
              className="text-gray-300 text-sm mb-1 block"
            >
              Team Lead
            </label>
            {!formData.lead && (
              <input
                id="teamLead"
                type="text"
                placeholder="Search and select lead"
                value={searchLead}
                onChange={(e) => setSearchLead(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white border border-[#333] focus:outline-none focus:border-[#B4DA00]"
              />
            )}
            {formData.lead && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-[#B4DA00] px-3 py-1.5 rounded-lg text-sm text-black flex items-center gap-2">
                  {formData.lead}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, lead: "" })}
                    className="text-black/60 hover:text-black font-bold text-lg leading-none"
                  >
                    &times;
                  </button>
                </span>
              </div>
            )}
            {searchLead.trim() && !formData.lead && (
              <div className="absolute z-10 w-full bg-[#222] rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg border border-[#333]">
                {availableLeads
                  .filter((m) =>
                    m.toLowerCase().includes(searchLead.toLowerCase())
                  )
                  .map((m) => (
                    <div
                      key={m}
                      className="cursor-pointer p-2 hover:bg-[#333]"
                      onClick={() => addLead(m)}
                    >
                      {m}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Team Sub Leads */}
          <div className="relative">
            <label
              htmlFor="teamSubLead"
              className="text-gray-300 text-sm mb-1 block"
            >
              Team Sub Leads
            </label>
            <input
              id="teamSubLead"
              type="text"
              placeholder="Search and select sub leads"
              value={searchSubLead}
              onChange={(e) => setSearchSubLead(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white border border-[#333] focus:outline-none focus:border-[#B4DA00]"
            />
            {formData.subLeads.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.subLeads.map((s) => (
                  <span
                    key={s}
                    className="bg-[#333] px-2 py-1 rounded-lg text-sm text-[#B4DA00] flex items-center gap-1.5"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          subLeads: formData.subLeads.filter(
                            (name) => name !== s
                          ),
                        })
                      }
                      className="text-[#B4DA00]/60 hover:text-[#B4DA00] font-bold text-md leading-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
            {searchSubLead.trim() && (
              <div className="absolute z-10 w-full bg-[#222] rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg border border-[#333]">
                {availableSubLeads
                  .filter((m) =>
                    m.toLowerCase().includes(searchSubLead.toLowerCase())
                  )
                  .map((m) => (
                    <div
                      key={m}
                      className="cursor-pointer p-2 hover:bg-[#333]"
                      onClick={() => addSubLead(m)}
                    >
                      {m}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Team Members */}
          <div className="relative">
            <label
              htmlFor="teamMember"
              className="text-gray-300 text-sm mb-1 block"
            >
              Team Members
            </label>
            <input
              id="teamMember"
              type="text"
              placeholder="Search and select members"
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white border border-[#333] focus:outline-none focus:border-[#B4DA00]"
            />
            {formData.members.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.members.map((m) => (
                  <span
                    key={m}
                    className="bg-[#333] px-2 py-1 rounded-lg text-sm text-[#B4DA00] flex items-center gap-1.5"
                  >
                    {m}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          members: formData.members.filter(
                            (name) => name !== m
                          ),
                        })
                      }
                      className="text-[#B4DA00]/60 hover:text-[#B4DA00] font-bold text-md leading-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
            {searchMember.trim() && (
              <div className="absolute z-10 w-full bg-[#222] rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg border border-[#333]">
                {availableMembers
                  .filter((m) =>
                    m.toLowerCase().includes(searchMember.toLowerCase())
                  )
                  .map((m) => (
                    <div
                      key={m}
                      className="cursor-pointer p-2 hover:bg-[#333]"
                      onClick={() => addMember(m)}
                    >
                      {m}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B4DA00] text-black rounded-lg hover:bg-[#A3C800] transition-colors font-medium"
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
