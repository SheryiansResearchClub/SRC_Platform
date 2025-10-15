import { queryClient } from '@/config/queryClient'
const isDev = import.meta.env.VITE_DEV === 'true'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDev && (
        <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
export default QueryProvider