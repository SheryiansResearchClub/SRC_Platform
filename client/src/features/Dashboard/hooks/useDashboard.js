// src/features/Dashboard/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import { dashboardMockApi } from '../api/dashboardMockApi';

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasksDueToday, setTasksDueToday] = useState([]);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({ unreadMessages: 0 });
  const [activityFeed, setActivityFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setDashboard(dashboardMockApi.getDashboard());
      setProjects(dashboardMockApi.getOngoingProjects());
      setTasksDueToday(dashboardMockApi.getTasksDueToday());
      setUrgentTasks(dashboardMockApi.getUrgentTasks());
      setUnreadMessages(dashboardMockApi.getUnreadMessages());
      setActivityFeed(dashboardMockApi.getActivityFeed());
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    dashboard,
    projects,
    tasksDueToday,
    urgentTasks,
    unreadMessages,
    activityFeed,
    isLoading,
  };
};
