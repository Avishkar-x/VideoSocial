import { useState, useEffect } from 'react'
import { useVideoLike, useCommentLike, useTweetLike } from '../../hooks/useLike'
import { useAuth } from '../../contexts/AuthContext'
import { ThumbsUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../lib/constants'
import { cn } from '../../utils/cn'
import { formatCount } from '../../utils/formatCount'

/**
 * Reusable Like button for videos, comments, and tweets.
 * @param {{ type: 'video' | 'comment' | 'tweet', targetId: string, isLiked: boolean, likeCount: number, parentId?: string, className?: string }} props
 */
export function LikeButton({ type, targetId, isLiked, likeCount, parentId, className }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [localIsLiked, setLocalIsLiked] = useState(isLiked)
  const [localLikeCount, setLocalLikeCount] = useState(likeCount)

  useEffect(() => {
    setLocalIsLiked(isLiked)
    setLocalLikeCount(likeCount)
  }, [isLiked, likeCount])

  // Select the appropriate mutation hook based on type
  const videoLike = useVideoLike(targetId)
  const commentLike = useCommentLike(parentId) // parentId = videoId for invalidation
  const tweetLike = useTweetLike(parentId) // parentId = userId for invalidation

  const getMutationState = () => {
    switch (type) {
      case 'video':
        return videoLike
      case 'comment':
        return commentLike
      case 'tweet':
        return tweetLike
      default:
        return { mutate: () => {}, isPending: false }
    }
  }

  const { mutate, isPending } = getMutationState()

  const handleToggle = (e) => {
    e.preventDefault()
    e.stopPropagation() // Prevent navigating to tweet/video if embedded
    
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN)
      return
    }

    // Optimistic local update
    const previousIsLiked = localIsLiked
    const previousLikeCount = localLikeCount
    
    setLocalIsLiked(!localIsLiked)
    setLocalLikeCount((prev) => (localIsLiked ? Math.max(0, prev - 1) : prev + 1))

    mutate(targetId, {
      onError: () => {
        // Rollback on error
        setLocalIsLiked(previousIsLiked)
        setLocalLikeCount(previousLikeCount)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
        localIsLiked
          ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-hover)] hover:text-[var(--color-text-primary)]',
        className
      )}
      aria-pressed={localIsLiked}
      aria-label={localIsLiked ? 'Unlike' : 'Like'}
    >
      <ThumbsUp
        className={cn('h-4 w-4', localIsLiked && 'fill-current')}
        aria-hidden="true"
      />
      {localLikeCount > 0 && <span>{formatCount(localLikeCount)}</span>}
    </button>
  )
}
