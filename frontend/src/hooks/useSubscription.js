import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  toggleSubscription,
  getSubscribedChannels,
  getChannelSubscribers,
} from '../api/subscription.api'
import { QUERY_KEYS } from '../lib/constants'
import toast from 'react-hot-toast'

/**
 * Hook to toggle subscription to a channel.
 * Uses optimistic updates to update the channel profile if we're on a channel page.
 * @param {string} username - Optional. If provided, updates the channel profile query.
 */
export function useToggleSubscription(username) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (channelId) => toggleSubscription(channelId),
    onMutate: async () => {
      let previousResponse = null

      if (username) {
        await queryClient.cancelQueries({ queryKey: QUERY_KEYS.channel(username) })
        previousResponse = queryClient.getQueryData(QUERY_KEYS.channel(username))
        const channelData = previousResponse?.data?.data

        if (channelData) {
          // Optimistically update the channel data nested in the axios response envelope
          queryClient.setQueryData(QUERY_KEYS.channel(username), {
            ...previousResponse,
            data: {
              ...previousResponse.data,
              data: {
                ...channelData,
                isSubscribed: !channelData.isSubscribed,
                subscribersCount: channelData.isSubscribed
                  ? channelData.subscribersCount - 1
                  : channelData.subscribersCount + 1,
              },
            },
          })
        }
      }
      return { previousResponse }
    },
    onError: (err, newSub, context) => {
      if (context?.previousResponse && username) {
        queryClient.setQueryData(QUERY_KEYS.channel(username), context.previousResponse)
      }
      toast.error(err?.response?.data?.message ?? 'Failed to update subscription.')
    },
    onSettled: () => {
      if (username) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channel(username) })
      }
      queryClient.invalidateQueries({ queryKey: ['subscribedChannels'] })
    },
  })
}

/**
 * Hook to get a user's subscribed channels.
 * @param {string} userId - Current user's ID
 */
export function useSubscribedChannels(userId) {
  return useQuery({
    queryKey: QUERY_KEYS.subscribedChannels(userId),
    queryFn: () => getSubscribedChannels(userId),
    enabled: !!userId,
  })
}

/**
 * Hook to get a channel's subscribers.
 * @param {string} channelId
 */
export function useChannelSubscribers(channelId) {
  return useQuery({
    queryKey: QUERY_KEYS.subscribers(channelId),
    queryFn: () => getChannelSubscribers(channelId),
    enabled: !!channelId,
  })
}
