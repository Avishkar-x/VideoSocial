import { VideoCard } from './VideoCard'
import { VideoCardSkeleton } from '../ui/Skeleton'

/**
 * Responsive grid layout for videos.
 * Handles loading states automatically.
 * @param {{ videos: Array, isLoading: boolean, loadingCount?: number, emptyMessage?: string }} props
 */
export function VideoGrid({
  videos = [],
  isLoading,
  loadingCount = 12,
  emptyMessage = 'No videos found.',
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
        {Array.from({ length: loadingCount }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!videos.length) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-text-secondary)] text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  )
}
