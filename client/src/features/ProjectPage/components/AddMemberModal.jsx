import React, { useState, useMemo } from "react";

export default function AddMemberModal({ onClose, onAdd }) {
  // Mock user list — replace with API data later
  const allUsers = [
    { id: 1, name: "Riya Patel", role: "Frontend Dev" },
    { id: 2, name: "Aarav Mehta", role: "Backend Dev" },
    { id: 3, name: "Ishaan Sharma", role: "UI/UX Designer" },
    { id: 4, name: "Neha Singh", role: "Project Manager" },
    { id: 5, name: "Kabir Khan", role: "Tester" },
  ];

  const [search, setSearch] = useState("");

  // Filter users as user types
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleAdd = (member) => {
    onAdd(member);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f] p-6 rounded-xl w-96 shadow-lg border border-zinc-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Add Member</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-md bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none"
        />

        {/* Filtered Results */}
        <div className="max-h-48 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleAdd(user)}
                className="flex justify-between items-center px-3 py-2 hover:bg-zinc-700 rounded-md cursor-pointer"
              >
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-xs text-zinc-400">{user.role}</p>
                </div>
                <button className="text-sm bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700">
                  Add
                </button>
              </div>
            ))
          ) : (
            <p className="text-zinc-400 text-sm text-center py-4">
              No results found
            </p>
          )}
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
