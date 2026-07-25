import { useQuery } from '@tanstack/react-query'
import { ThumbsUp } from 'lucide-react'
import { getLikedVideos } from '../api/like.api'
import { VideoCard } from '../components/common/VideoCard'
import { PageSkeleton } from '../components/ui/Skeleton'
import { QUERY_KEYS } from '../lib/constants'

export default function LikedVideosPage() {
  const { data: response, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.likedVideos,
    queryFn: getLikedVideos,
    staleTime: 1000 * 60, // 1 minute
  })

  // Backend: getLikedVideos returns array of like docs where each has a `video` field
  // Shape: [{ _id, video: { _id, title, thumbnail, duration, views, createdAt, owner: {...} }, ...}]
  const likeEntries = response?.data?.data ?? []
  // Normalize: extract the video from each like entry
  const videos = likeEntries
    .filter((entry) => entry?.video?._id)
    .map((entry) => entry.video)

  if (isLoading) return <PageSkeleton />

  if (isError) {
    return (
      <div className="p-4 rounded-xl bg-[var(--color-destructive)]/10 text-[var(--color-destructive)] text-sm">
        Failed to load liked videos.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border-default)]">
        <div className="h-10 w-10 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center shrink-0">
          <ThumbsUp className="h-5 w-5 text-[var(--color-text-secondary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Liked Videos</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {videos.length} liked {videos.length === 1 ? 'video' : 'videos'}
          </p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <ThumbsUp className="h-14 w-14 text-[var(--color-text-secondary)] opacity-30" />
          <p className="text-[var(--color-text-primary)] font-semibold">No liked videos yet</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Like videos to save them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}
