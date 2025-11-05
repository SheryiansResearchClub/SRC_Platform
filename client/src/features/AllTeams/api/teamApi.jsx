// api/teamsApi.js

// Mock API for Teams
export const fetchTeams = async () => {
  return Promise.resolve([
    {
      id: 1,
      name: "Developers Team",
      members: "Current Team",
      icon: "ri-code-s-slash-line",
      color: "bg-indigo-600",
    },
    {
      id: 2,
      name: "Designers Hub",
      members: "12 members",
      icon: "ri-palette-line",
      color: "bg-pink-600",
    },
    {
      id: 3,
      name: "Marketing Crew",
      members: "8 members",
      icon: "ri-megaphone-line",
      color: "bg-teal-600",
    },
    {
      id: 4,
      name: "HR Department",
      members: "4 members",
      icon: "ri-user-search-line",
      color: "bg-yellow-700",
    },
  ]);
};
