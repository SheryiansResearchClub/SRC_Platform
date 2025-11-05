import React from "react";
import { useParams } from "react-router-dom";
import TeamMembersCard from "../components/TeamMembersCard";
import RecentActivitiesCard from "../components/RecentActivitiesCard";

export default function TeamProfilePage() {
  const { id } = useParams();
  const teams = JSON.parse(localStorage.getItem("teams") || "[]");
  const team = teams.find((t) => String(t.id) === id);

  if (!team)
    return (
      <div className="p-10 text-white bg-[#0B0C0D] min-h-screen">
        <h1 className="text-2xl font-semibold">Team not found</h1>
      </div>
    );

  const allMembers = [];

  if (team.teamLead) {
    allMembers.push({ name: team.teamLead, role: "lead" });
  }

  (team.teamSubLeads || []).forEach((name) => {
    allMembers.push({ name, role: "sub-lead" });
  });

  (team.teamMembers || []).forEach((name) => {
    allMembers.push({ name, role: "member" });
  });

  return (
    <div className="p-6 md:p-10 text-white bg-[#0B0C0D] min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-6">{team.teamName}</h1>

      <div className="flex flex-col gap-6">
        <TeamMembersCard allMembers={allMembers} />
        <RecentActivitiesCard />
      </div>
    </div>
  );
}
