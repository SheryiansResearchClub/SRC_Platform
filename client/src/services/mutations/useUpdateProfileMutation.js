import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useHttpClient } from '@/hooks/useHttpClient'
import { queryKeys } from '@/services/queryKeys'

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()
  const { put } = useHttpClient()

  return useMutation({
    mutationFn: (payload) =>
      put('/profile', payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() })
      queryClient.setQueryData(queryKeys.users.profile(), (prev) => ({
        ...prev,
        ...data,
      }))

      if (variables?.preferences) {
        queryClient.invalidateQueries({ queryKey: queryKeys.app.settings })
      }
    },
  })
}
