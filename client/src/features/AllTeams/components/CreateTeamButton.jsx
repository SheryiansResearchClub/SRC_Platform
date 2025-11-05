import React, { useState } from "react";
import CreateTeamForm from "./CreateTeamForm";

export default function CreateTeamButton({ role, onTeamCreate }) {
  const [open, setOpen] = useState(false);

  if (role !== "leader" && role !== "admin") return null;

  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen(true)}
        className="bg-[#B4DA00] hover:bg-[#A3C800] text-black font-medium px-6 py-2.5 rounded-lg transition-all"
      >
        + Create New Team
      </button>

      {open && (
        <CreateTeamForm
          onClose={() => setOpen(false)}
          onCreate={(newTeam) => {
            if (onTeamCreate) onTeamCreate(newTeam);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
