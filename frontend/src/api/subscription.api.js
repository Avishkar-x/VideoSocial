import axiosInstance from './axiosInstance'

/**
 * Toggle subscription to a channel.
 * Returns { subscribed: boolean }
 * @param {string} channelId
 */
export function toggleSubscription(channelId) {
  return axiosInstance.post(`/subscriptions/c/${channelId}`)
}

/**
 * Get channels that a user is subscribed to.
 * @param {string} subscriberId - must be the current user's _id
 */
export function getSubscribedChannels(subscriberId) {
  return axiosInstance.get(`/subscriptions/u/${subscriberId}`)
}

/**
 * Get subscribers of a channel (owner only).
 * @param {string} channelId
 */
export function getChannelSubscribers(channelId) {
  return axiosInstance.get(`/subscriptions/c/${channelId}`)
}
