import axiosInstance from './axiosInstance'

/**
 * Get a channel's public profile by username.
 * Returns: { _id, fullName, username, avatar, coverImage, email,
 *            subscribersCount, channelsSubscribedToCount, isSubscribed }
 * @param {string} username
 */
export function getChannelProfile(username) {
  return axiosInstance.get(`/users/c/${username}`)
}

/**
 * Get the current user's watch history (array of videos with owner).
 */
export function getWatchHistory() {
  return axiosInstance.get('/users/history')
}

/**
 * Update the current user's account details.
 * @param {{ fullName: string, email: string }} data
 */
export function updateAccount(data) {
  return axiosInstance.patch('/users/update-account', data)
}

/**
 * Change the current user's password.
 * @param {{ oldPassword: string, newPassword: string }} data
 */
export function changePassword(data) {
  return axiosInstance.post('/users/change-password', data)
}

/**
 * Update the current user's avatar.
 * @param {FormData} formData - must contain 'avatar' field
 */
export function updateAvatar(formData) {
  return axiosInstance.patch('/users/avatar', formData)
}

/**
 * Update the current user's cover image.
 * @param {FormData} formData - must contain 'coverImage' field
 */
export function updateCoverImage(formData) {
  return axiosInstance.patch('/users/cover-image', formData)
}
