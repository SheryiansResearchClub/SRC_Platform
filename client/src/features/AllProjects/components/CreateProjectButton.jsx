import React, { useState, useEffect } from "react";

export default function CreateProjectButton({ setProjects }) {
  const [open, setOpen] = useState(false);

  const currentUser = { name: "Riya Infinity" };

  const mockMembers = [
    "Riya Infinity",
    "Aarav Patel",
    "Neha Sharma",
    "Vikram Singh",
    "Tanya Verma",
  ];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    leads: [],
    members: [],
    tags: [],
    dueDate: "",
    createdBy: currentUser.name,
  });

  const [searchLead, setSearchLead] = useState("");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchMember, setSearchMember] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (searchLead)
      setFilteredLeads(
        mockMembers.filter(
          (m) =>
            m.toLowerCase().includes(searchLead.toLowerCase()) &&
            !formData.leads.includes(m)
        )
      );
    else setFilteredLeads([]);

    if (searchMember)
      setFilteredMembers(
        mockMembers.filter(
          (m) =>
            m.toLowerCase().includes(searchMember.toLowerCase()) &&
            !formData.members.includes(m)
        )
      );
    else setFilteredMembers([]);
  }, [searchLead, searchMember, formData.leads, formData.members]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLead = (lead) => {
    setFormData((prev) => ({ ...prev, leads: [...prev.leads, lead] }));
    setSearchLead("");
  };

  const handleRemoveLead = (lead) => {
    setFormData((prev) => ({
      ...prev,
      leads: prev.leads.filter((m) => m !== lead),
    }));
  };

  const handleAddMember = (member) => {
    setFormData((prev) => ({ ...prev, members: [...prev.members, member] }));
    setSearchMember("");
  };

  const handleRemoveMember = (member) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m !== member),
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProject = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      leads: formData.leads,
      members: formData.members,
      tags: formData.tags,
      dueDate: formData.dueDate,
      createdBy: formData.createdBy,
      status: "Todo",
    };

    setProjects((prev) => [...prev, newProject]);

    setOpen(false);
    setFormData({
      title: "",
      description: "",
      leads: [],
      members: [],
      tags: [],
      dueDate: "",
      createdBy: currentUser.name,
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#B4DA00] hover:bg-black hover:text-[#B4DA00] text-black font-medium border border-white border-[2px] px-4 py-2 rounded-[30px]"
      >
        Create Project
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-[#111315] border border-[#2b2c2e] rounded-xl w-[420px] max-h-[75vh] overflow-y-auto shadow-lg custom-scrollbar">
            <div className="p-5">
              <h2 className="text-lg font-semibold text-white mb-3">
                Create New Project
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-[#1b1c1e] text-white p-2 rounded-md border border-[#2b2c2e]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-[#1b1c1e] text-white p-2 rounded-md border border-[#2b2c2e]"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Leads
                  </label>
                  <input
                    type="text"
                    value={searchLead}
                    onChange={(e) => setSearchLead(e.target.value)}
                    placeholder="Search and add leads..."
                    className="w-full bg-[#1b1c1e] text-white p-2 rounded-md border border-[#2b2c2e]"
                  />
                  {filteredLeads.length > 0 && (
                    <ul className="bg-[#1b1c1e] border border-[#2b2c2e] rounded-md mt-1 max-h-24 overflow-y-auto custom-scrollbar">
                      {filteredLeads.map((m) => (
                        <li
                          key={m}
                          onClick={() => handleAddLead(m)}
                          className="p-2 cursor-pointer hover:bg-[#2b2c2e] text-white text-sm"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  )}
                  {formData.leads.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.leads.map((m) => (
                        <span
                          key={m}
                          className="bg-green-700 text-white px-2 py-0.5 rounded-md text-xs flex items-center gap-2"
                        >
                          {m}
                          <button
                            type="button"
                            onClick={() => handleRemoveLead(m)}
                            className="text-gray-300 hover:text-white"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Members
                  </label>
                  <input
                    type="text"
                    value={searchMember}
                    onChange={(e) => setSearchMember(e.target.value)}
                    placeholder="Search and add members..."
                    className="w-full bg-[#1b1c1e] text-white p-2 rounded-md border border-[#2b2c2e]"
                  />
                  {filteredMembers.length > 0 && (
                    <ul className="bg-[#1b1c1e] border border-[#2b2c2e] rounded-md mt-1 max-h-24 overflow-y-auto custom-scrollbar">
                      {filteredMembers.map((m) => (
                        <li
                          key={m}
                          onClick={() => handleAddMember(m)}
                          className="p-2 cursor-pointer hover:bg-[#2b2c2e] text-white text-sm"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  )}
                  {formData.members.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.members.map((m) => (
                        <span
                          key={m}
                          className="bg-blue-700 text-white px-2 py-0.5 rounded-md text-xs flex items-center gap-2"
                        >
                          {m}
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(m)}
                            className="text-gray-300 hover:text-white"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Tags
                  </label>
                  <form onSubmit={handleAddTag}>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Press Enter to add tag"
                      className="w-full bg-[#1b1c1e] text-white p-2 rounded-md border border-[#2b2c2e]"
                    />
                  </form>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-purple-700 text-white px-2 py-0.5 rounded-md text-xs flex items-center gap-2"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-gray-300 hover:text-white"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full bg-[#1b1c1e] text-white p-2 rounded-md border border-[#2b2c2e]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Created By
                  </label>
                  <input
                    type="text"
                    name="createdBy"
                    value={formData.createdBy}
                    disabled
                    className="w-full bg-[#1b1c1e] text-gray-400 p-2 rounded-md border border-[#2b2c2e] cursor-not-allowed"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .custom-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
