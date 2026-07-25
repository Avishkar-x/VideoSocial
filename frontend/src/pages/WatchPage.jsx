import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useVideo, useVideos } from '../hooks/useVideos'
import { useAuth } from '../contexts/AuthContext'
import { VideoPlayer } from '../components/watch/VideoPlayer'
import { CommentSection } from '../components/watch/CommentSection'
import { VideoCard } from '../components/common/VideoCard'
import { LikeButton } from '../components/common/LikeButton'
import { SubscribeButton } from '../components/common/SubscribeButton'
import { Avatar } from '../components/ui/Avatar'
import { PageSkeleton, VideoCardSkeleton } from '../components/ui/Skeleton'
import { SaveToPlaylistModal } from '../components/ui/SaveToPlaylistModal'
import { formatCount } from '../utils/formatCount'
import { formatAbsoluteDate } from '../utils/formatDate'
import { ROUTES } from '../lib/constants'
import { cn } from '../utils/cn'
import { BookmarkPlus } from 'lucide-react'

export default function WatchPage() {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser, isAuthenticated } = useAuth()

  // Main video
  const { data: videoRes, isLoading: isVideoLoading, isError } = useVideo(videoId)
  const video = videoRes?.data?.data

  // Recommendations feed
  const { data: recRes, isLoading: isRecLoading } = useVideos({ limit: 10 })
  const recommendations = recRes?.data?.data?.docs?.filter((v) => v._id !== videoId) || []

  const [descExpanded, setDescExpanded] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)

  if (isVideoLoading) {
    return <PageSkeleton />
  }

  if (isError || !video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Video not found</h2>
        <p className="text-[var(--color-text-secondary)] mt-2">
          This video may have been deleted or is private.
        </p>
        <Link to={ROUTES.HOME} className="mt-4 text-[var(--color-accent)] hover:underline font-medium">
          Go back home
        </Link>
      </div>
    )
  }

  const { title, description, videoFile, thumbnail, owner, views, createdAt, likes, isLiked, comments } = video

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN)
      return
    }
    setSaveModalOpen(true)
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 max-w-[1600px] mx-auto">
      {/* Primary Column (Video + Info + Comments) */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Player */}
        <VideoPlayer src={videoFile} poster={thumbnail} />

        {/* Video Info */}
        <div className="flex flex-col gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]">
            {title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Owner Info & Subscribe */}
            <div className="flex items-center gap-4">
              <Link to={ROUTES.CHANNEL(owner?.username)} className="shrink-0 rounded-full">
                <Avatar src={owner?.avatar} alt={owner?.fullName} size="md" />
              </Link>
              <div className="flex flex-col">
                <Link
                  to={ROUTES.CHANNEL(owner?.username)}
                  className="font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors line-clamp-1"
                >
                  {owner?.fullName}
                </Link>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  @{owner?.username}
                </span>
              </div>
              {currentUser?._id !== owner?._id && (
                <div className="ml-2">
                  <SubscribeButton
                    channelId={owner?._id}
                    isSubscribed={false} /* Handled by SubscribeButton internally, though passing false might cause flash. If backend provided isSubscribed on owner object, we'd use it here. */
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <div className="flex items-center bg-[var(--color-bg-surface)] rounded-full h-9">
                <LikeButton
                  type="video"
                  targetId={video._id}
                  isLiked={isLiked}
                  likeCount={likes}
                  className="h-full rounded-r-none hover:bg-[var(--color-bg-surface-hover)] border-r border-[var(--color-border-default)]"
                />
                <button
                  onClick={handleSaveClick}
                  className="flex items-center gap-1.5 px-3 h-full rounded-r-full text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors"
                  aria-label="Save to playlist"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description Box */}
        <div
          className={cn(
            'bg-[var(--color-bg-surface)] rounded-xl p-3 md:p-4 text-sm mt-2 transition-all cursor-pointer hover:bg-[var(--color-bg-surface-hover)]',
            !descExpanded && 'line-clamp-3'
          )}
          onClick={() => setDescExpanded(!descExpanded)}
        >
          <div className="font-semibold text-[var(--color-text-primary)] mb-1">
            {formatCount(views)} views &nbsp;•&nbsp; {formatAbsoluteDate(createdAt)}
          </div>
          <p className="text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed">
            {description}
          </p>
          {!descExpanded && (
            <span className="font-semibold text-[var(--color-text-primary)] mt-1 block">
              Show more
            </span>
          )}
          {descExpanded && (
            <span className="font-semibold text-[var(--color-text-primary)] mt-4 block">
              Show less
            </span>
          )}
        </div>

        {/* Comments */}
        <CommentSection videoId={videoId} initialCount={comments} />
      </div>

      {/* Secondary Column (Recommendations) */}
      <div className="xl:w-[400px] shrink-0 flex flex-col gap-4">
        <h3 className="font-bold text-[var(--color-text-primary)] hidden xl:block">
          Up next
        </h3>
        <div className="flex flex-col gap-3">
          {isRecLoading ? (
            Array.from({ length: 5 }).map((_, i) => <VideoCardSkeleton key={i} />)
          ) : (
            recommendations.map((recVideo) => (
              <VideoCard key={recVideo._id} video={recVideo} />
            ))
          )}
        </div>
      </div>
      
      {/* Save Modal */}
      <SaveToPlaylistModal
        videoId={videoId}
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
      />
    </div>
  )
}
