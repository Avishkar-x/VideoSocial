import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAccount, changePassword, updateAvatar, updateCoverImage } from '../api/user.api'
import { QUERY_KEYS } from '../lib/constants'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

/**
 * Hook for updating account details (name + email).
 * Updates the AuthContext user on success.
 */
export function useUpdateAccount() {
  const { updateUser } = useAuth()

  return useMutation({
    mutationFn: (data) => updateAccount(data),
    onSuccess: (res) => {
      // Update AuthContext with the fresh user from the response
      // res is raw axios response; payload is res.data.data
      if (res?.data?.data) {
        updateUser(res.data.data)
      }
      toast.success('Account details updated.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update account details.')
    },
  })
}

/**
 * Hook for changing password.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data) => changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to change password.')
    },
  })
}

/**
 * Hook for updating avatar.
 * Updates the AuthContext user on success.
 */
export function useUpdateAvatar() {
  const { updateUser } = useAuth()

  return useMutation({
    mutationFn: (formData) => updateAvatar(formData),
    onSuccess: (res) => {
      // res is raw axios response; payload is res.data.data = updated user
      if (res?.data?.data) {
        updateUser(res.data.data)
      }
      toast.success('Profile photo updated.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update profile photo.')
    },
  })
}

/**
 * Hook for updating cover image.
 * Updates the AuthContext user on success.
 */
export function useUpdateCoverImage() {
  const { updateUser } = useAuth()

  return useMutation({
    mutationFn: (formData) => updateCoverImage(formData),
    onSuccess: (res) => {
      // res is raw axios response; payload is res.data.data = updated user
      if (res?.data?.data) {
        updateUser(res.data.data)
      }
      toast.success('Cover image updated.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update cover image.')
    },
  })
}
