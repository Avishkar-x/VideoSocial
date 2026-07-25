import { useQuery } from '@tanstack/react-query'
import { getChannelProfile } from '../api/user.api'
import { QUERY_KEYS } from '../lib/constants'

/**
 * Hook to fetch a channel's public profile by username.
 * @param {string} username
 */
export function useChannelProfile(username) {
  return useQuery({
    queryKey: QUERY_KEYS.channel(username),
    queryFn: () => getChannelProfile(username),
    enabled: !!username,
    retry: 1, // Only retry once, as 404s are common for invalid usernames
  })
}
