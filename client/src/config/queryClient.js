import { QueryClient } from '@tanstack/react-query'

const isDev = import.meta.env.VITE_DEV === 'true'

const retryDelay = (attemptIndex = 0) =>
  Math.min(1000 * (2 ** attemptIndex), 30_000)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 2,
      retryDelay,
    },
    mutations: {
      retry: 1,
      retryDelay,
      onError: (error) => {
        if (isDev) {
          console.error('Mutation failed', error)
        }
      },
    },
  },
})

export default queryClient
