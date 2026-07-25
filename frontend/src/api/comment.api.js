import axiosInstance from './axiosInstance'

/**
 * Get paginated comments for a video.
 * @param {string} videoId
 * @param {{ page?, limit? }} params
 */
export function getVideoComments(videoId, params = {}) {
  return axiosInstance.get(`/comments/${videoId}`, { params })
}

/**
 * Add a comment to a video.
 * @param {string} videoId
 * @param {string} content
 */
export function addComment(videoId, content) {
  return axiosInstance.post(`/comments/${videoId}`, { content })
}

/**
 * Update an existing comment.
 * @param {string} commentId
 * @param {string} content
 */
export function updateComment(commentId, content) {
  return axiosInstance.patch(`/comments/c/${commentId}`, { content })
}

/**
 * Delete a comment.
 * @param {string} commentId
 */
export function deleteComment(commentId) {
  return axiosInstance.delete(`/comments/c/${commentId}`)
}
