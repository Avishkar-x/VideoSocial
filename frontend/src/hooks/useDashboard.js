import { useQuery } from '@tanstack/react-query'
import { getChannelStats, getChannelVideos } from '../api/dashboard.api'
import { QUERY_KEYS } from '../lib/constants'

/**
 * Hook to fetch channel stats for the dashboard.
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardStats,
    queryFn: getChannelStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch the channel's video list for the dashboard management table.
 */
export function useDashboardVideos() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardVideos,
    queryFn: getChannelVideos,
    staleTime: 1000 * 60, // 1 minute
  })
}
