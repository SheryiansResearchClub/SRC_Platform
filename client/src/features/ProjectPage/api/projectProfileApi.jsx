export const projectProfileApi = {
  getProjectProfile: () => ({
    id: "P1234",
    name: "AI-Powered Task Manager",
    description:
      "A collaborative platform for teams to manage tasks using AI suggestions and predictive deadlines. lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua., lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "Ongoing",
    startDate: "2025-03-01",
    endDate: "2025-12-15",

    teamMembers: [
      { id: 1, name: "Riya Infinity", role: "Frontend Developer" },
      { id: 2, name: "Aman Verma", role: "Backend Developer" },
      { id: 3, name: "Sneha Kapoor", role: "UI/UX Designer" },
      { id: 4, name: "Harsh Sharma", role: "Project Manager" },
      { id: 5, name: "Sagar Saxena", role: "QA Engineer" },
    ],

    assignee: "Harsh Sharma",
    tags: ["Web App", "Landing Page", "Open Source"],

    tasks: [
      { id: 1, title: "Complete dashboard", completed: true },
      { id: 2, title: "Complete dashboardI", completed: true },
      { id: 3, title: "Complete Navigation-baar", completed: true },
      { id: 4, title: "Complete dashboard", completed: true },
    ],

    comments: [
      {
        id: 1,
        user: {
          name: "Sagar Saxena",
          avatar: "https://placehold.co/36x36/60A5FA/FFFFFF?text=SS",
        },
        message: "want to get access to commit the Untitled File",
        file: "Untitled File",
        role: "Admin Space",
        time: "2 hours ago",
        type: "access-request",
      },
      {
        id: 2,
        user: {
          name: "Sneha Kapoor",
          avatar: "https://placehold.co/36x36/F472B6/FFFFFF?text=SK",
        },
        message: "I just finished designing the whole admin section",
        time: "1 day ago",
        type: "status-update",
      },
      {
        id: 3,
        user: {
          name: "Aman Verma",
          avatar: "https://placehold.co/36x36/34D399/FFFFFF?text=AV",
        },
        message: "Backend API for user auth is complete and deployed.",
        time: "1 day ago",
        type: "status-update",
      },
    ],

    progress: 68,
    milestones: [
      { id: 1, title: "Project Setup", completed: true },
      { id: 2, title: "Authentication Module", completed: true },
      { id: 3, title: "Dashboard Design", completed: true },
      { id: 4, title: "AI Integration", completed: false },
      { id: 5, title: "Final Deployment", completed: false },
    ],
    repoLink: "https://github.com/yourusername/ai-task-manager",
    documents: [
      { name: "Project Proposal.pdf", type: "pdf", uploadedBy: "Admin" },
      { name: "Wireframes.zip", type: "zip", uploadedBy: "Sneha Kapoor" },
    ],
  }),
};
