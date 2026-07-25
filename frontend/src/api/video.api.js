import axiosInstance from './axiosInstance'

/**
 * Fetch paginated list of videos.
 * @param {{ page?, limit?, query?, sortBy?, sortType?, userId? }} params
 */
export function getAllVideos(params = {}) {
  return axiosInstance.get('/videos', { params })
}

/**
 * Fetch a single video by ID.
 * Increments view count and updates watch history.
 * @param {string} videoId
 */
export function getVideoById(videoId) {
  return axiosInstance.get(`/videos/${videoId}`)
}

/**
 * Publish a new video.
 * @param {FormData} formData - title, description, videoFile, thumbnail, isPublished?
 */
export function publishVideo(formData) {
  return axiosInstance.post('/videos', formData)
}

/**
 * Update video title, description, or thumbnail.
 * @param {string} videoId
 * @param {FormData} formData
 */
export function updateVideo(videoId, formData) {
  return axiosInstance.patch(`/videos/${videoId}`, formData)
}

/**
 * Delete a video.
 * @param {string} videoId
 */
export function deleteVideo(videoId) {
  return axiosInstance.delete(`/videos/${videoId}`)
}

/**
 * Toggle a video's published/unpublished state.
 * @param {string} videoId
 */
export function togglePublishStatus(videoId) {
  return axiosInstance.patch(`/videos/toggle/publish/${videoId}`)
}
