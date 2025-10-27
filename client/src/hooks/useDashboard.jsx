// src/hooks/useDashboard.jsx
import { useQuery } from '@tanstack/react-query'

// --- Mock Data ---
const mockOverview = {
  user: {
    id: "userId1",
    name: "John Doe",
    avatarUrl: "https://cdn.example.com/avatar.jpg",
    points: 120,
    badges: ["badgeId1", "badgeId2"]
  },
  projectsCount: { ongoing: 5, completed: 3 },
  tasksCount: { todo: 10, inProgress: 5, review: 2, done: 8 },
  unreadNotifications: 7,
  upcomingDeadlines: 3
}

const mockProjects = [
  { projectId: "projectId1", title: "AI Nutri App", status: "ongoing", progress: 70, membersCount: 5, tasksCount: 50, completedTasks: 35 },
  { projectId: "projectId2", title: "Stay Safe Security App", status: "ongoing", progress: 40, membersCount: 6, tasksCount: 60, completedTasks: 24 }
]

const mockTasksToday = [
  { taskId: "taskId1", title: "Design login screen", projectId: "projectId1", status: "in-progress", priority: "high", dueDate: "2025-10-13T23:59:59Z" },
  { taskId: "taskId2", title: "Fix API bug", projectId: "projectId2", status: "todo", priority: "urgent", dueDate: "2025-10-13T17:00:00Z" }
]

const mockUrgentTasks = [
  { taskId: "taskId3", title: "Deploy backend", projectId: "projectId1", status: "todo", priority: "urgent", dueDate: "2025-10-12T23:59:59Z", overdue: true },
  { taskId: "taskId4", title: "Write documentation", projectId: "projectId2", status: "in-progress", priority: "urgent", dueDate: "2025-10-14T12:00:00Z", overdue: false }
]

const mockMessages = { unreadMessages: 12 }

const mockActivity = [
  { type: "task", action: "assigned", taskId: "taskId1", title: "Design login screen", projectId: "projectId1", byUser: { id: "userId2", name: "Jane Smith" }, timestamp: "2025-10-13T09:00:00Z" },
  { type: "comment", action: "added", commentId: "commentId1", content: "Please update the logo.", projectId: "projectId1", byUser: { id: "userId3", name: "Alice" }, timestamp: "2025-10-13T10:30:00Z" },
  { type: "file", action: "uploaded", fileId: "fileId1", name: "requirements.pdf", projectId: "projectId2", byUser: { id: "userId2", name: "Jane Smith" }, timestamp: "2025-10-13T11:00:00Z" }
]

// --- Combined Hook with mock queries ---
export const useDashboard = () => {
  const overview = useQuery({ queryKey: ['dashboardOverview'], queryFn: () => mockOverview })
  const projects = useQuery({ queryKey: ['dashboardProjects'], queryFn: () => mockProjects })
  const tasksToday = useQuery({ queryKey: ['tasksDueToday'], queryFn: () => mockTasksToday })
  const urgentTasks = useQuery({ queryKey: ['urgentTasks'], queryFn: () => mockUrgentTasks })
  const messages = useQuery({ queryKey: ['unreadMessages'], queryFn: () => mockMessages })
  const activity = useQuery({ queryKey: ['dashboardActivity'], queryFn: () => mockActivity })

  return { overview, projects, tasksToday, urgentTasks, messages, activity }
}
