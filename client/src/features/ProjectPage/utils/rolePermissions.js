export const rolePermissions = {
  admin: {
    canAddMembers: true,
    canDeleteMembers: true,
    canEditTasks: true,
  },
  leader: {
    canAddMembers: true,
    canDeleteMembers: false,
    canEditTasks: true,
  },
  member: {
    canAddMembers: false,
    canDeleteMembers: false,
    canEditTasks: false,
  },
};
