import axiosInstance from './axiosInstance'

/**
 * Get aggregated stats for the current user's channel.
 * Returns: { totalVideos, publishedVideos, unpublishedVideos, totalViews, totalLikes,
 *            totalComments, averageViews, totalSubscribers }
 */
export function getChannelStats() {
  return axiosInstance.get('/dashboard/stats')
}

/**
 * Get all videos uploaded by the current user (for the dashboard table).
 * Returns an array of videos without description/owner.
 */
export function getChannelVideos() {
  return axiosInstance.get('/dashboard/videos')
}
