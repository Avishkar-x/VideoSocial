import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { History, Trash2 } from 'lucide-react'
import { getWatchHistory } from '../api/user.api'
import { VideoCard } from '../components/common/VideoCard'
import { PageSkeleton, VideoCardSkeleton } from '../components/ui/Skeleton'
import { QUERY_KEYS } from '../lib/constants'

export default function WatchHistoryPage() {
  const { data: response, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.watchHistory,
    queryFn: getWatchHistory,
    staleTime: 1000 * 60, // 1 minute
  })

  // Backend returns the watchHistory array directly as response.data.data
  const watchHistory = response?.data?.data ?? []

  if (isLoading) return <PageSkeleton />

  if (isError) {
    return (
      <div className="p-4 rounded-xl bg-[var(--color-destructive)]/10 text-[var(--color-destructive)] text-sm">
        Failed to load watch history.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--color-border-default)]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center shrink-0">
            <History className="h-5 w-5 text-[var(--color-text-secondary)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Watch History</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {watchHistory.length} videos watched
            </p>
          </div>
        </div>
      </div>

      {watchHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <History className="h-14 w-14 text-[var(--color-text-secondary)] opacity-30" />
          <p className="text-[var(--color-text-primary)] font-semibold">No watch history yet</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Videos you watch will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {watchHistory.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}
