import { cn } from '../../utils/cn'

/**
 * Animated shimmer skeleton block.
 * @param {{ className?: string, rounded?: string }} props
 */
export function Skeleton({ className, rounded = 'rounded-lg' }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--color-bg-surface-hover)]',
        rounded,
        className,
      )}
      aria-hidden="true"
    />
  )
}

/**
 * Pre-built skeleton for a video card (thumbnail + lines).
 */
export function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Thumbnail */}
      <Skeleton className="w-full aspect-video" />
      <div className="flex gap-3 px-1">
        {/* Avatar */}
        <Skeleton className="h-9 w-9 shrink-0" rounded="rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          {/* Title lines */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          {/* Meta line */}
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  )
}

/**
 * Pre-built skeleton for a grid of video cards.
 * @param {{ count?: number }} props
 */
export function VideoGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Skeleton for a comment row (avatar + text lines).
 */
export function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-9 w-9 shrink-0" rounded="rounded-full" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}

/**
 * Full-page centered loading fallback.
 */
export function PageSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px]" aria-label="Loading...">
      <div
        className="h-10 w-10 rounded-full border-2 border-[var(--color-border-default)] border-t-[var(--color-accent)] animate-spin"
        role="status"
      />
    </div>
  )
}
