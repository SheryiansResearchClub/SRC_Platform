// src/features/tasks/tasksAPI.js
export const fetchTasksAPI = async () => {
    // simulate fetch delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            title: "Fix the SRC Website",
            creator: "Aayush Chouhan",
            assigned: "Sarthak Sharma",
            priority: "High",
            created: "10/29/2025",
            due: "10/31/2025",
            status: "Working",
          },
          {
            title: "AROX Landing page",
            creator: "Sarthak Sharma",
            assigned: "Arnav Verma",
            priority: "Low",
            created: "5/29/2025",
            due: "12/31/2025",
            status: "Completed",
          },
          {
            title: "Website SEO",
            creator: "Sarthak Sharma",
            assigned: "Aayush Chouhan",
            priority: "Urgent",
            created: "1/29/2025",
            due: "10/31/2025",
            status: "Not Started",
          },
        ]);
      }, 500);
    });
  };
  
  export const addTaskAPI = async (task) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...task,
          created: new Date().toLocaleDateString(),
          status: "Not Started",
        });
      }, 300);
    });
  };
  