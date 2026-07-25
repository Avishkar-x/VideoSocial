import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useVideos } from '../hooks/useVideos'
import { VideoGrid } from '../components/common/VideoGrid'
import { Pagination } from '../components/common/Pagination'
import { PAGINATION } from '../lib/constants'

export default function ChannelVideosTab() {
  const { userId } = useOutletContext()
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE)

  const { data: response, isLoading } = useVideos({
    userId,
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
  })

  const videos = response?.data?.data?.docs || []
  const totalPages = response?.data?.data?.totalPages || 1

  return (
    <div className="flex flex-col gap-6">
      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        loadingCount={PAGINATION.DEFAULT_LIMIT}
        emptyMessage="This channel hasn't uploaded any videos yet."
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          setPage(p)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    </div>
  )
}
