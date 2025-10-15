import { useQuery } from '@tanstack/react-query'

import { useHttpClient } from '@/hooks/useHttpClient'
import { queryKeys } from '@/services/queryKeys'

export const useAppSettingsQuery = () => {
  const { get } = useHttpClient()

  return useQuery({
    queryKey: queryKeys.app.settings,
    queryFn: () => get('/app/settings'),
  })
}