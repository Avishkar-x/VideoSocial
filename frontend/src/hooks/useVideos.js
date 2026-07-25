import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllVideos, getVideoById } from '../api/video.api'
import { QUERY_KEYS, PAGINATION } from '../lib/constants'

/**
 * Paginated video feed (page-based, not infinite scroll).
 * @param {{ page?, limit?, query?, sortBy?, sortType?, userId? }} params
 */
export function useVideos(params = {}) {
  const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, ...rest } = params

  return useQuery({
    queryKey: QUERY_KEYS.videos({ page, limit, ...rest }),
    queryFn: () => getAllVideos({ page, limit, sortBy: 'createdAt', sortType: 'desc', ...rest }),
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  })
}

/**
 * Fetch a single video by ID.
 * Only enabled when videoId is truthy.
 * @param {string} videoId
 */
export function useVideo(videoId) {
  return useQuery({
    queryKey: QUERY_KEYS.video(videoId),
    queryFn: () => getVideoById(videoId),
    enabled: !!videoId,
    staleTime: 0, // always refetch to increment views correctly
    retry: 1,
  })
}
