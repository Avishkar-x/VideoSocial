import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTweet, getUserTweets, updateTweet, deleteTweet } from '../api/tweet.api'
import { QUERY_KEYS } from '../lib/constants'
import toast from 'react-hot-toast'

/**
 * Hook to fetch a user's tweets.
 * @param {string} userId
 */
export function useUserTweets(userId) {
  return useQuery({
    queryKey: QUERY_KEYS.tweets(userId),
    queryFn: () => getUserTweets(userId),
    enabled: !!userId,
  })
}

/**
 * Hooks for tweet mutations (create, update, delete).
 * @param {string} userId - User ID to invalidate tweets query for.
 */
export function useTweetMutations(userId) {
  const queryClient = useQueryClient()
  const key = QUERY_KEYS.tweets(userId)

  const add = useMutation({
    mutationFn: (content) => createTweet(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      toast.success('Tweet posted!')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to post tweet.')
    },
  })

  const update = useMutation({
    mutationFn: ({ tweetId, content }) => updateTweet(tweetId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      toast.success('Tweet updated.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update tweet.')
    },
  })

  const remove = useMutation({
    mutationFn: (tweetId) => deleteTweet(tweetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      toast.success('Tweet deleted.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete tweet.')
    },
  })

  return { add, update, remove }
}
