// This mocks a network request
const mockProjects = [
  {
    id: 1,
    status: "Ongoing",
    title: "Focus Flow",
    tags: ["Open Source", "Web App", "5★ Rating", "Active"],
    createdBy: "Sarah Johnson",
    createdOn: "Aug 20, 2025",
    lead: "Ethan Clarke",
    contributors: [
      "https://i.pravatar.cc/40?img=5",
      "https://i.pravatar.cc/40?img=6",
      "https://i.pravatar.cc/40?img=7",
    ],
  },
  {
    id: 2,
    status: "Ongoing",
    title: "DesignPilot",
    tags: ["Internal", "UI Tool", "Alpha"],
    createdBy: "Michael Chen",
    createdOn: "Jul 15, 2025",
    lead: "Emily Davis",
    contributors: [
      "https://i.pravatar.cc/40?img=8",
      "https://i.pravatar.cc/40?img=9",
      "https://i.pravatar.cc/40?img=10",
    ],
  },
  {
    id: 3,
    status: "Completed",
    title: "Designathon",
    tags: ["Hackathon", "UI Tool", "Completed"],
    createdBy: "James Carter",
    createdOn: "May 2, 2025",
    lead: "Olivia Bennett",
    contributors: [
      "https://i.pravatar.cc/40?img=11",
      "https://i.pravatar.cc/40?img=12",
      "https://i.pravatar.cc/40?img=13",
    ],
  },
  {
    id: 4,
    status: "Todo",
    title: "New Launch",
    tags: ["Planned", "Upcoming"],
    createdBy: "Ava Wilson",
    createdOn: "Oct 1, 2025",
    lead: "Liam Brown",
    contributors: [],
  },
];

/**
 * Fetches the mock project data.
 * @returns {Promise<Array<Object>>} A promise that resolves with the project list.
 */
export const fetchProjectsApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProjects);
    }, 500);
  });
};
