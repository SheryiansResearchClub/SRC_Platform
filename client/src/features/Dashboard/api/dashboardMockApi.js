// src/features/Dashboard/api/dashboardMockApi.js

export const dashboardMockApi = {
  getDashboard: () => ({
    resources: [
      { name: 'React Hooks Guide.pdf', author: 'John Doe', type: 'pdf' },
      { name: 'Node.js Starter.zip', author: 'Jane Smith', type: 'zip' },
      { name: 'API Docs.docx', author: 'Admin', type: 'doc' },
      { name: 'Tutorial.mp4', author: 'John Doe', type: 'vid' },
    ],
    events: [
      { title: 'Discussion About Client Landing Page', time: '10:00 AM', author: 'Admin', type: 'discord' },
      { title: 'Backend Integration Sprint', time: '02:00 PM', author: 'Jane Smith', type: 'meet' },
    ],
  }),
  getOngoingProjects: () => [
    { 
      projectId: 1, 
      title: 'AI Chatbot Integration', 
      progress: 85, 
      dueDate: '2025-11-07', 
      category: 'Web', 
      tags: ['Design', 'AI', 'High'],
      members: [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=2',
        'https://i.pravatar.cc/150?img=3',
      ]
    },
    { 
      projectId: 2, 
      title: 'Landing Page Design', 
      progress: 76, 
      dueDate: '2025-11-23', 
      category: 'Web', 
      tags: ['Design', 'High'],
      members: [
        'https://i.pravatar.cc/150?img=4',
        'https://i.pravatar.cc/150?img=5',
        'https://i.pravatar.cc/150?img=6',
      ]
    },
    { 
      projectId: 3, 
      title: 'AI Chatbot Integration', 
      progress: 97, 
      dueDate: '2025-12-04', 
      category: 'Backend', 
      tags: ['Design', 'High'],
      members: [
        'https://i.pravatar.cc/150?img=7',
        'https://i.pravatar.cc/150?img=8',
      ]
    },
  ],
  getTasksDueToday: () => [
    { title: 'Design Landing Page Footer', dueDate: '2025-10-25', status: 'done' },
    { title: 'Fix AI Chat Bot Backend', dueDate: '2025-10-25', status: 'pending' },
    { title: 'Integrate HPC and Prisma', dueDate: '2025-10-25', status: 'pending' },
  ],
};
