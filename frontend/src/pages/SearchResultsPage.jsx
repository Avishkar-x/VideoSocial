import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useVideos } from '../hooks/useVideos'
import { VideoGrid } from '../components/common/VideoGrid'
import { Pagination } from '../components/common/Pagination'
import { PAGINATION } from '../lib/constants'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE)

  // Reset page to 1 when query changes
  useEffect(() => {
    setPage(PAGINATION.DEFAULT_PAGE)
  }, [query])

  const { data: response, isLoading, isError, error } = useVideos({
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
    query,
  })

  const videos = response?.data?.data?.docs || []
  const totalPages = response?.data?.data?.totalPages || 1

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border-default)]">
        <div className="h-10 w-10 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center shrink-0">
          <Search className="h-5 w-5 text-[var(--color-text-secondary)]" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            Search results
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {query ? `Showing results for "${query}"` : 'Enter a search term'}
          </p>
        </div>
      </div>

      {!query ? (
        <div className="text-sm text-[var(--color-text-secondary)]">
          Please enter a search term in the search bar above.
        </div>
      ) : isError ? (
        <div className="p-4 rounded-xl bg-[var(--color-destructive)]/10 text-[var(--color-destructive)] text-sm">
          {error?.response?.data?.message ?? 'Failed to load search results.'}
        </div>
      ) : (
        <>
          <VideoGrid
            videos={videos}
            isLoading={isLoading}
            loadingCount={PAGINATION.DEFAULT_LIMIT}
            emptyMessage={`No results found for "${query}". Try different keywords.`}
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
