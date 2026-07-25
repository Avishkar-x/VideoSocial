import axiosInstance from './axiosInstance'

/**
 * Create a new playlist.
 * @param {{ name: string, description: string }} data
 */
export function createPlaylist(data) {
  return axiosInstance.post('/playlist', data)
}

/**
 * Get all playlists for a user.
 * Returns: [{ _id, name, description, totalVideos, thumbnail, createdAt }]
 * @param {string} userId
 */
export function getUserPlaylists(userId) {
  return axiosInstance.get(`/playlist/user/${userId}`)
}

/**
 * Get a single playlist with full populated video list.
 * @param {string} playlistId
 */
export function getPlaylistById(playlistId) {
  return axiosInstance.get(`/playlist/${playlistId}`)
}

/**
 * Update a playlist's name and description.
 * @param {string} playlistId
 * @param {{ name: string, description: string }} data
 */
export function updatePlaylist(playlistId, data) {
  return axiosInstance.patch(`/playlist/${playlistId}`, data)
}

/**
 * Delete a playlist.
 * @param {string} playlistId
 */
export function deletePlaylist(playlistId) {
  return axiosInstance.delete(`/playlist/${playlistId}`)
}

/**
 * Add a video to a playlist.
 * @param {string} videoId
 * @param {string} playlistId
 */
export function addVideoToPlaylist(videoId, playlistId) {
  return axiosInstance.patch(`/playlist/add/${videoId}/${playlistId}`)
}

/**
 * Remove a video from a playlist.
 * @param {string} videoId
 * @param {string} playlistId
 */
export function removeVideoFromPlaylist(videoId, playlistId) {
  return axiosInstance.patch(`/playlist/remove/${videoId}/${playlistId}`)
}
