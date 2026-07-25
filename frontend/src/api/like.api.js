import axiosInstance from './axiosInstance'

/**
 * Toggle like on a video.
 * Returns { liked: boolean }
 * @param {string} videoId
 */
export function toggleVideoLike(videoId) {
  return axiosInstance.post(`/likes/toggle/v/${videoId}`)
}

/**
 * Toggle like on a comment.
 * Returns { liked: boolean }
 * @param {string} commentId
 */
export function toggleCommentLike(commentId) {
  return axiosInstance.post(`/likes/toggle/c/${commentId}`)
}

/**
 * Toggle like on a tweet.
 * Returns { liked: boolean }
 * @param {string} tweetId
 */
export function toggleTweetLike(tweetId) {
  return axiosInstance.post(`/likes/toggle/t/${tweetId}`)
}

/**
 * Get all videos liked by the current user.
 * Returns an array of like documents with populated video.
 */
export function getLikedVideos() {
  return axiosInstance.get('/likes/videos')
}
