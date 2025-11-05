// --- Mock Data with Full Structure ---
// This is the complete data for all your teams.
const MOCK_TEAMS_DATA = [
  {
    id: 1,
    teamName: "Developers Team",
    icon: "ri-code-s-slash-line",
    color: "bg-indigo-600",
    teamLead: "Apoorva Khare",
    teamSubLeads: ["Gautam"],
    teamMembers: ["Priya Sharma", "Rohan Verma", "Aarav Singh"],
  },
  {
    id: 2,
    teamName: "Designers Hub",
    icon: "ri-palette-line",
    color: "bg-pink-600",
    teamLead: "Sneha Reddy",
    teamSubLeads: [],
    teamMembers: ["Vikram Patel", "Meera Desai"],
  },
  {
    id: 3,
    teamName: "Marketing",
    icon: "ri-bar-chart-fill",
    color: "bg-green-600",
    teamLead: "Ankit Jain",
    teamSubLeads: ["Riya Gupta"],
    teamMembers: ["Karan Mehta"],
  },
];

// --- Helper Function to Setup LocalStorage ---
// This checks if 'teams' data exists. If not, it sets it.
const initializeLocalStorage = () => {
  const teams = localStorage.getItem("teams");
  if (!teams || teams === "[]") {
    localStorage.setItem("teams", JSON.stringify(MOCK_TEAMS_DATA));
  }
};

// Run the initializer immediately when the app loads this file
initializeLocalStorage();

// --- Your API Functions ---

/**
 * Fetches a list of all teams for summary cards (like on a dashboard).
 * This function now reads from localStorage and formats the data
 * just like your original 'fetchTeams' function.
 */
export const fetchTeams = async () => {
  const teams = JSON.parse(localStorage.getItem("teams") || "[]");

  // Transform the full data into the summary format you wanted
  const teamList = teams.map(team => {
    // Calculate total members
    const totalMembers = 
      (team.teamMembers?.length || 0) + 
      (team.teamSubLeads?.length || 0) + 
      (team.teamLead ? 1 : 0);

    return {
      id: team.id,
      name: team.teamName, // Use 'name' to match your original function
      members: `${totalMembers} members`, // Create the member count string
      icon: team.icon,
      color: team.color,
    };
  });

  return Promise.resolve(teamList);
};

/**
 * Gets the complete, detailed data for a single team by its ID.
 */
export const getTeamById = async (id) => {
  const teams = JSON.parse(localStorage.getItem("teams") || "[]");
  
  // Find the team, making sure to compare numbers
  const team = teams.find((t) => t.id === Number(id));
  
  return Promise.resolve(team); // Return the found team (or undefined)
};