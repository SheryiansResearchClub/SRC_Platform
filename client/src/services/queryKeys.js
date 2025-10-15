export const queryKeys = {
  app: {
    settings: ['app', 'settings'],
  },
  users: {
    profile: (userId = 'me') => ['users', userId, 'profile'],
  },
}

export default queryKeys