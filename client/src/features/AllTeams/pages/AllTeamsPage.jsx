import React, { useEffect, useState } from "react";
import { fetchTeams } from "../api/teamApi";
import TeamList from "../components/TeamList";
import CreateTeamButton from "../components/CreateTeamButton";
import "remixicon/fonts/remixicon.css";

export default function AllTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = {
    name: "Riya Infinity",
    role: "leader",
  };

  const layoutClasses =
    "px-20 py-10 bg-[#0B0C0D] min-h-screen ml-[-3vw] mt-[-6.5vh] mr-[-0.5vw] mb-[-8vh] flex flex-col";

  // Load teams (from localStorage or mock)
  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
      setLoading(false);
    } else {
      fetchTeams().then((data) => {
        setTeams(data);
        localStorage.setItem("teams", JSON.stringify(data));
        setLoading(false);
      });
    }
  }, []);

  // Function to add a new team
  const handleAddTeam = (newTeam) => {
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  if (loading) {
    return (
      <div className={layoutClasses}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className={layoutClasses}>
      <div className="w-full text-white">
        <h1 className="text-3xl font-semibold">Select a Team</h1>
        <p className="text-gray-400 mt-2 mb-8">
          Choose a team to switch your current workspace.
        </p>

        <TeamList teams={teams} />

        <CreateTeamButton role={currentUser.role} onTeamCreate={handleAddTeam} />
      </div>
    </div>
  );
}
