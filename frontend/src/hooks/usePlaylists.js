import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from '../api/playlist.api'
import { QUERY_KEYS } from '../lib/constants'
import toast from 'react-hot-toast'

/**
 * Get all playlists for a user.
 * @param {string} userId
 */
export function useUserPlaylists(userId) {
  return useQuery({
    queryKey: QUERY_KEYS.playlists(userId),
    queryFn: () => getUserPlaylists(userId),
    enabled: !!userId,
  })
}

/**
 * Get a single playlist by ID with full video list.
 * @param {string} playlistId
 */
export function usePlaylist(playlistId) {
  return useQuery({
    queryKey: QUERY_KEYS.playlist(playlistId),
    queryFn: () => getPlaylistById(playlistId),
    enabled: !!playlistId,
    retry: 1,
  })
}

/**
 * Mutations for playlist CRUD (create, update, delete).
 * @param {string} userId - For invalidating the user's playlist list.
 */
export function usePlaylistMutations(userId) {
  const queryClient = useQueryClient()
  const listKey = QUERY_KEYS.playlists(userId)

  const create = useMutation({
    mutationFn: (data) => createPlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey })
      toast.success('Playlist created.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create playlist.')
    },
  })

  const update = useMutation({
    mutationFn: ({ playlistId, data }) => updatePlaylist(playlistId, data),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: listKey })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlist(playlistId) })
      toast.success('Playlist updated.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update playlist.')
    },
  })

  const remove = useMutation({
    mutationFn: (playlistId) => deletePlaylist(playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey })
      toast.success('Playlist deleted.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete playlist.')
    },
  })

  return { create, update, remove }
}

/**
 * Mutations for adding/removing a video from a playlist.
 * @param {string} playlistId
 */
export function usePlaylistVideoMutations(playlistId) {
  const queryClient = useQueryClient()
  const key = QUERY_KEYS.playlist(playlistId)

  const addVideo = useMutation({
    mutationFn: (videoId) => addVideoToPlaylist(videoId, playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      toast.success('Added to playlist.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to add to playlist.')
    },
  })

  const removeVideo = useMutation({
    mutationFn: (videoId) => removeVideoFromPlaylist(videoId, playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      toast.success('Removed from playlist.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to remove from playlist.')
    },
  })

  return { addVideo, removeVideo }
}

/**
 * Hook to add a video to any of the user's playlists (for "Save to playlist" flow).
 * Returns addToPlaylist and removeFromPlaylist mutators that work by playlist ID.
 */
export function useSaveToPlaylist() {
  const queryClient = useQueryClient()

  const addVideo = useMutation({
    mutationFn: ({ videoId, playlistId }) => addVideoToPlaylist(videoId, playlistId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlist(playlistId) })
      toast.success('Saved to playlist.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to save to playlist.')
    },
  })

  const removeVideo = useMutation({
    mutationFn: ({ videoId, playlistId }) => removeVideoFromPlaylist(videoId, playlistId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlist(playlistId) })
      toast.success('Removed from playlist.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Failed to remove from playlist.')
    },
  })

  return { addVideo, removeVideo }
}
