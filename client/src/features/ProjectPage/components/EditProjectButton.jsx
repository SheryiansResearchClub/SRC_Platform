import React, { useState } from "react";
import Button from "./Button";
import { Edit, X } from "lucide-react";
import TeamMemberItem from "./TeamMemberItem";

export default function EditProjectButton({ currentUser, project, onSave }) {
  const [open, setOpen] = useState(false);

  // Check if the current user has permission to manage roles
  const canManageRoles =
    currentUser?.role === "admin" || currentUser?.role === "leader";

  const allMembers = [
    { name: "Sarah Johnson", role: "Frontend Dev" },
    { name: "Ethan Clarke", role: "Backend Dev" },
    { name: "Emma Brown", role: "UI/UX Designer" },
    { name: "Michael Green", role: "Fullstack Dev" },
    { name: "Sophia Miller", role: "Project Manager" },
  ];

  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "Ongoing",
    tags: project?.tags?.join(", ") || "",
    repoLink: project?.repoLink || "",
    members: project?.teamMembers || [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length > 0) {
      const results = allMembers.filter((member) =>
        member.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMembers(results);
    } else {
      setFilteredMembers([]);
    }
  };

  const handleAddMember = (member) => {
    if (!formData.members.some((m) => m.name === member.name)) {
      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, member],
      }));
    }
    setSearchQuery("");
    setFilteredMembers([]);
  };

  const handleRemoveMember = (name) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.name !== name),
    }));
  };

  // --- NEW ---
  // Handler to update a member's role
  const handleRoleChange = (name, newRole) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.name === name ? { ...m, role: newRole } : m
      ),
    }));
  };
  // --- END NEW ---

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="primary"
        icon={<Edit />}
        onClick={() => setOpen(true)}
        currentUser={currentUser}
      >
        Edit Project
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111315] text-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Project</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ... other form fields (Project Name, Description, etc.) ... */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-[#1a1c1e] border border-gray-700 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md bg-[#1a1c1e] border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-[#1a1c1e] border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-[#1a1c1e] border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Repository Link</label>
                <input
                  type="url"
                  name="repoLink"
                  value={formData.repoLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-[#1a1c1e] border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* --- MODIFIED MEMBER SECTION --- */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Project Members</label>

                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 rounded-md bg-[#1a1c1e] border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />

                  {filteredMembers.length > 0 && (
                    <div className="absolute z-10 bg-[#1a1c1e] border border-gray-700 rounded-md w-full mt-1 max-h-40 overflow-y-auto">
                      {filteredMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleAddMember(member)}
                        >
                          {member.name}{" "}
                          <span className="text-gray-400 text-xs">
                            ({member.role})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {formData.members.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {formData.members.map((member, idx) => {
                      // Create a unique set of roles
                      const roleOptions = Array.from(
                        new Set([member.role, "lead", "sub-lead"])
                      );

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-[#1a1c1e] px-3 py-2 rounded-md"
                        >
                          <TeamMemberItem member={member} />

                          {/* --- NEW ROLE DROPDOWN & REMOVE BUTTON --- */}
                          <div className="flex items-center space-x-2">
                            {canManageRoles && (
                              <select
                                value={member.role}
                                onChange={(e) =>
                                  handleRoleChange(member.name, e.target.value)
                                }
                                className="text-xs px-2 py-1 rounded-md bg-[#1f2123] border border-gray-600 focus:border-blue-500 focus:outline-none"
                                onClick={(e) => e.stopPropagation()} // Prevent click events from bubbling
                              >
                                {roleOptions.map((role) => (
                                  <option key={role} value={role}>
                                    {role}
                                  </option>
                                ))}
                              </select>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.name)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          {/* --- END NEW --- */}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* --- END MODIFIED MEMBER SECTION --- */}

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="ghost" onClick={() => setOpen(false)} currentUser={currentUser}>
                  Cancel
                </Button>
                <Button variant="success" type="submit" currentUser={currentUser}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}