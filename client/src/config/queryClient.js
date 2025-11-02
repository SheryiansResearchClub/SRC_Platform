import { QueryClient } from '@tanstack/react-query'

const isDev = import.meta.env.MODE === 'development'

const retryDelay = (attempt = 0) => Math.min(1000 * 2 ** attempt, 30_000)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes fresh
      gcTime: 30 * 60 * 1000,        // garbage collect after 30 minutes

      refetchOnWindowFocus: false,   // prevent flicker when user switches tabs
      refetchOnReconnect: true,      // refetch if connection was lost
      refetchOnMount: false,         // don’t re-fetch if data is fresh
      retry: 2,                      // retry twice before failing
      retryDelay,                    // backoff delay

      keepPreviousData: true,        // keeps old data during refetch
      networkMode: 'online',         // skip if offline
    },

    mutations: {
      retry: 1,
      retryDelay,
      networkMode: 'online',
      onError: (error) => {
        if (isDev) console.error('Mutation failed:', error)
      },
    },
  },
  logger: {
    log: (...args) => isDev && console.log(...args),
    warn: (...args) => isDev && console.warn(...args),
    error: (...args) => isDev && console.error(...args),
  },
})

export default queryClient