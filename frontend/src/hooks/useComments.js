import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from '../api/comment.api'
import { QUERY_KEYS, PAGINATION } from '../lib/constants'
import toast from 'react-hot-toast'

/**
 * Infinite-scroll paginated comments for a video.
 * @param {string} videoId
 */
export function useComments(videoId) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.comments(videoId),
    queryFn: ({ pageParam = 1 }) =>
      getVideoComments(videoId, { page: pageParam, limit: PAGINATION.COMMENTS_LIMIT }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // lastPage is the raw axios response; paginated data is at lastPage.data.data
      const pageData = lastPage?.data?.data
      if (pageData?.hasNextPage) return pageData.nextPage
      return undefined
    },
    enabled: !!videoId,
  })
}

/**
 * Mutations: add, update, delete comment.
 * All mutations invalidate the comments query on success.
 * @param {string} videoId
 */
export function useCommentMutations(videoId) {
  const queryClient = useQueryClient()
  const key = QUERY_KEYS.comments(videoId)

  const add = useMutation({
    mutationFn: (content) => addComment(videoId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Failed to post comment.')
    },
  })

  const update = useMutation({
    mutationFn: ({ commentId, content }) => updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      toast.success('Comment updated.')
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Failed to update comment.')
    },
  })

  const remove = useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      toast.success('Comment deleted.')
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Failed to delete comment.')
    },
  })

  return { add, update, remove }
}
