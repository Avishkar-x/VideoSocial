import { memo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePlaylist, usePlaylistVideoMutations } from '../hooks/usePlaylists'
import { useAuth } from '../contexts/AuthContext'
import { VideoCard } from '../components/common/VideoCard'
import { PageSkeleton, VideoCardSkeleton } from '../components/ui/Skeleton'
import { DropdownMenu, DropdownItem } from '../components/ui/DropdownMenu'
import { ListVideo, ArrowLeft, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { formatCount } from '../utils/formatCount'
import { ROUTES } from '../lib/constants'

export default function PlaylistPage() {
  const { playlistId } = useParams()
  const { user } = useAuth()
  const { data: response, isLoading, isError } = usePlaylist(playlistId)
  const { removeVideo } = usePlaylistVideoMutations(playlistId)
  const playlist = response?.data?.data

  if (isLoading) return <PageSkeleton />

  if (isError || !playlist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
        <ListVideo className="h-12 w-12 text-[var(--color-text-secondary)] opacity-40" />
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Playlist not found</h2>
        <Link to={ROUTES.HOME} className="text-[var(--color-accent)] hover:underline font-medium">
          Go back home
        </Link>
      </div>
    )
  }

  const videos = playlist.videos || []
  const isOwner = user?._id === playlist.owner?.toString?.() || user?._id === playlist.owner

  return (
    <div className="flex flex-col xl:flex-row gap-8 max-w-[1400px] mx-auto w-full">
      {/* Playlist Info Panel */}
      <div className="xl:w-[320px] shrink-0 flex flex-col gap-4">
        {/* Cover */}
        <div className="aspect-video rounded-xl overflow-hidden bg-[var(--color-bg-surface-hover)] relative">
          {videos[0]?.thumbnail ? (
            <img
              src={videos[0].thumbnail}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ListVideo className="h-16 w-16 text-[var(--color-text-secondary)] opacity-30" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
            <span className="text-white text-lg font-bold line-clamp-2">{playlist.name}</span>
          </div>
        </div>

        {/* Playlist Metadata */}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {playlist.description}
          </p>
          <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2">
            <ListVideo className="h-3.5 w-3.5" />
            {formatCount(videos.length)} videos
          </div>
        </div>

        {/* Play All button */}
        {videos.length > 0 && (
          <Link
            to={ROUTES.WATCH(videos[0]._id)}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium transition-colors"
          >
            ▶ Play All
          </Link>
        )}
      </div>

      {/* Video List */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
          {playlist.name}
        </h1>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[var(--color-text-secondary)]">
            <ListVideo className="h-12 w-12 opacity-40 mb-4" />
            <p>This playlist is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                actionMenu={
                  isOwner ? (
                    <DropdownMenu
                      trigger={
                        <button
                          className="p-1 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                          aria-label="More actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      }
                    >
                      <DropdownItem
                        danger
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (confirm('Remove video from playlist?')) {
                            removeVideo.mutate(video._id)
                          }
                        }}
                        disabled={removeVideo.isPending && removeVideo.variables === video._id}
                      >
                        <Trash2 className="h-4 w-4 shrink-0" />
                        Remove from playlist
                      </DropdownItem>
                    </DropdownMenu>
                  ) : null
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
