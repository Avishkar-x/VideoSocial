import { Link } from 'react-router-dom'
import { MoreVertical } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { formatCount } from '../../utils/formatCount'
import { formatRelativeDate } from '../../utils/formatDate'
import { formatDuration } from '../../utils/formatDuration'
import { ROUTES } from '../../lib/constants'

/**
 * Reusable video card component for grids.
 * @param {{ video: object, actionMenu?: React.ReactNode }} props
 */
export function VideoCard({ video, actionMenu }) {
  const {
    _id,
    title,
    thumbnail,
    duration,
    views = 0,
    createdAt,
    owner,
  } = video

  return (
    <div className="flex flex-col gap-3 group">
      {/* Thumbnail Container */}
      <Link
        to={ROUTES.WATCH(_id)}
        className="relative aspect-video rounded-xl overflow-hidden bg-[var(--color-bg-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]"
      >
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Duration badge */}
        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-medium rounded shadow-sm backdrop-blur-sm">
          {formatDuration(duration)}
        </div>
      </Link>

      {/* Info Container */}
      <div className="flex gap-3 items-start pr-4 relative">
        <Link
          to={ROUTES.CHANNEL(owner?.username)}
          className="shrink-0 pt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] rounded-full"
          tabIndex={-1}
        >
          <Avatar src={owner?.avatar} alt={owner?.fullName} size="sm" />
        </Link>

        <div className="flex flex-col min-w-0 flex-1">
          <Link
            to={ROUTES.WATCH(_id)}
            className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 leading-snug group-hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] rounded-sm"
            title={title}
          >
            {title}
          </Link>
          <Link
            to={ROUTES.CHANNEL(owner?.username)}
            className="text-xs text-[var(--color-text-secondary)] mt-1 hover:text-[var(--color-text-primary)] transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] rounded-sm"
          >
            {owner?.fullName}
          </Link>
          <div className="text-xs text-[var(--color-text-secondary)] mt-0.5 flex items-center gap-1">
            <span>{formatCount(views)} views</span>
            <span className="text-[10px]">•</span>
            <span>{formatRelativeDate(createdAt)}</span>
          </div>
        </div>

        {/* Action Menu */}
        {actionMenu ? (
          <div className="absolute right-0 top-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10">
            {actionMenu}
          </div>
        ) : (
          <button
            className="absolute right-0 top-0.5 p-1 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] cursor-pointer z-10"
            aria-label="More actions"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // Placeholder for context menu
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
