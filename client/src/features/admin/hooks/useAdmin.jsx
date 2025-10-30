import {
  updateUser,
  deleteUser
} from "@/features/admin/api/adminApi"
import { useMutation } from "@tanstack/react-query"

const useAdmin = () => {

  const updateProfile = (data) => useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: updateUser,
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const deleteProfile = (id) => useMutation({
    mutationKey: ["deleteProfile"],
    mutationFn: deleteUser,
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  return {
    updateProfile,
    deleteProfile,
  }
}

export default useAdmin