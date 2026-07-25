import axiosInstance from './axiosInstance'

/**
 * Create a tweet.
 * @param {string} content
 */
export function createTweet(content) {
  return axiosInstance.post('/tweets', { content })
}

/**
 * Get all tweets for a user (sorted newest first).
 * @param {string} userId
 */
export function getUserTweets(userId) {
  return axiosInstance.get(`/tweets/user/${userId}`)
}

/**
 * Update a tweet's content.
 * @param {string} tweetId
 * @param {string} content
 */
export function updateTweet(tweetId, content) {
  return axiosInstance.patch(`/tweets/${tweetId}`, { content })
}

/**
 * Delete a tweet.
 * @param {string} tweetId
 */
export function deleteTweet(tweetId) {
  return axiosInstance.delete(`/tweets/${tweetId}`)
}
