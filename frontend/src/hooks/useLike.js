import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleVideoLike, toggleCommentLike, toggleTweetLike } from '../api/like.api'
import { QUERY_KEYS } from '../lib/constants'
import toast from 'react-hot-toast'

/**
 * Hook for toggling video likes.
 * Uses optimistic updates for instant UI feedback.
 * @param {string} videoId
 */
export function useVideoLike(videoId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleVideoLike(videoId),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.video(videoId) })

      // Snapshot the previous value (full axios response)
      const previousResponse = queryClient.getQueryData(QUERY_KEYS.video(videoId))
      const videoData = previousResponse?.data?.data

      // Optimistically update the video inside the response envelope
      if (videoData) {
        queryClient.setQueryData(QUERY_KEYS.video(videoId), {
          ...previousResponse,
          data: {
            ...previousResponse.data,
            data: {
              ...videoData,
              isLiked: !videoData.isLiked,
              likes: videoData.isLiked ? videoData.likes - 1 : videoData.likes + 1,
            },
          },
        })
      }

      return { previousResponse }
    },
    onError: (err, newLike, context) => {
      if (context?.previousResponse) {
        queryClient.setQueryData(QUERY_KEYS.video(videoId), context.previousResponse)
      }
      toast.error('Failed to update like status.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.video(videoId) })
    },
  })
}

/**
 * Hook for toggling comment likes.
 * Note: Since comments are in an infinite list, optimistic updates are more complex.
 * We'll use a simpler invalidate approach here.
 * @param {string} videoId - The video the comment belongs to (for invalidation)
 */
export function useCommentLike(videoId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId) => toggleCommentLike(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(videoId) })
    },
    onError: () => {
      toast.error('Failed to like comment.')
    },
  })
}

/**
 * Hook for toggling tweet likes.
 * @param {string} userId - The user the tweet belongs to (for invalidation)
 */
export function useTweetLike(userId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tweetId) => toggleTweetLike(tweetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tweets(userId) })
    },
    onError: () => {
      toast.error('Failed to like tweet.')
    },
  })
}
