import React from "react";
import { useNavigate } from "react-router-dom";
import TeamRow from "./TeamRow";

export default function TeamList({ teams }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#111315] rounded-lg shadow-xl w-full">
      {teams.map((team, index) => (
        <div
          key={team.id}
          onClick={() => navigate(`/app/teams/${team.id}`)}
        >
          <TeamRow
            team={team}
            isFirst={index === 0}
            isLast={index === teams.length - 1}
            hasBorder={index !== teams.length - 1}
          />
        </div>
      ))}
    </div>
  );
}
