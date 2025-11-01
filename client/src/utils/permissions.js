/**
 * Defines all permissions for each role.
 * This object is the single source of truth for all role-based permissions.
 */
export const Permissions = {
  admin: {
    canViewAllUsers: true,
    canAddMembers: true,
    canDeleteMembers: true,
    canEditTasks: true,
  },
  leader: {
    canViewAllUsers: true,
    canAddMembers: true,
    canDeleteMembers: false,
    canEditTasks: true,
  },
  member: {
    canViewAllUsers: false,
    canAddMembers: false,
    canDeleteMembers: false,
    canEditTasks: false,
  },
  // You can add other roles like 'guest', 'client', etc.
};

/**
 * Checks if a user has a specific permission based on their role.
 * @param {string} role - The user's role (e.g., 'admin', 'member').
 * @param {string} permission - The permission to check (e.g., 'canViewAllUsers').
 * @returns {boolean} - True if the user has the permission, false otherwise.
 */
export const checkPermission = (role, permission) => {
  if (!role) {
    return false; // No role, no permissions
  }
  
  const normalizedRole = role.toLowerCase();
  
  // Check if the role exists
  if (!Permissions[normalizedRole]) {
    console.warn(`Unknown role: ${role}`);
    return false;
  }
  
  // Check for the permission. Defaults to false if the permission isn't defined
  // for that role.
  return Permissions[normalizedRole][permission] ?? false;
};