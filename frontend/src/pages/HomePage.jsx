import { useState } from 'react'
import { useVideos } from '../hooks/useVideos'
import { VideoGrid } from '../components/common/VideoGrid'
import { Pagination } from '../components/common/Pagination'
import { PAGINATION } from '../lib/constants'

export default function HomePage() {
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE)

  // Fetch videos for the current page
  const { data: response, isLoading, isError, error } = useVideos({
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
  })

  const videos = response?.data?.data?.docs || []
  const totalPages = response?.data?.data?.totalPages || 1

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">Home Feed</h1>

      {isError ? (
        <div className="p-4 rounded-xl bg-[var(--color-destructive)]/10 text-[var(--color-destructive)] text-sm">
          {error?.response?.data?.message ?? 'Failed to load videos. Please try again.'}
        </div>
      ) : (
        <>
          <VideoGrid
            videos={videos}
            isLoading={isLoading}
            loadingCount={PAGINATION.DEFAULT_LIMIT}
            emptyMessage="No videos uploaded yet. Be the first to upload!"
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </>
      )}
    </div>
  )
}
