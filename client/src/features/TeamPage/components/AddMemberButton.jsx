import React, { useState } from "react";
import { checkPermission } from "../../../utils/permissions";

const mockAllUsers = [
  { name: "Riya Infinity", role: "admin" },
  { name: "Aarav Patel", role: "member" },
  { name: "Neha Sharma", role: "member" },
  { name: "Tanya Verma", role: "sublead" },
];

export default function AddMemberButton({ onAddMember, currentMembers = [] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const currentUserRole = "admin"; // you can make this dynamic later
  if (!checkPermission(currentUserRole, "canAddMembers")) return null;

  // ✅ Names of already added members
  const currentMemberNames = currentMembers.map((m) => m.name);

  // ✅ Remove already added members from the master list
  const availableUsers = mockAllUsers.filter(
    (user) => !currentMemberNames.includes(user.name)
  );

  // ✅ Apply search filter to available users
  const filtered = availableUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (user) => {
    onAddMember(user);
    setOpen(false);
    setSearch(""); // clear search
  };

  const handleClose = () => {
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        + Add Member
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl p-6 w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Add a Team Member</h3>

            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-[#1e1e1e] border border-[#363636] text-white"
            />

            <div className="max-h-48 overflow-y-auto space-y-2">
              {filtered.length > 0 ? (
                filtered.map((user) => (
                  <div
                    key={user.name}
                    onClick={() => handleAdd(user)}
                    className="p-2 rounded hover:bg-[#333333] cursor-pointer"
                  >
                    {user.name}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No users found</p>
              )}
            </div>

            <button
              onClick={handleClose}
              className="mt-4 w-full py-2 rounded bg-[#393939] hover:bg-[#333333] text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
