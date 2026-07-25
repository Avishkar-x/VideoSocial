import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useComments, useCommentMutations } from '../../hooks/useComments'
import { useCommentLike } from '../../hooks/useLike'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Input'
import { DropdownMenu, DropdownItem } from '../ui/DropdownMenu'
import { CommentSkeleton } from '../ui/Skeleton'
import { formatRelativeDate } from '../../utils/formatDate'
import { formatCount } from '../../utils/formatCount'
import { ROUTES } from '../../lib/constants'
import { cn } from '../../utils/cn'
import { LikeButton } from '../common/LikeButton'

export function CommentSection({ videoId, initialCount = 0 }) {
  const { isAuthenticated, user } = useAuth()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useComments(videoId)
  const { add, update, remove } = useCommentMutations(videoId)

  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  const comments = data?.pages.flatMap((page) => page.data?.data?.docs) || []
  // Keep optimistic count accurate
  const displayCount = data?.pages[0]?.data?.data?.totalDocs ?? initialCount

  const handlePost = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    add.mutate(newComment, {
      onSuccess: () => setNewComment(''),
    })
  }

  const handleSaveEdit = (commentId) => {
    if (!editContent.trim()) return
    update.mutate({ commentId, content: editContent }, {
      onSuccess: () => setEditingId(null)
    })
  }

  return (
    <div className="flex flex-col gap-6 mt-6">
      <h3 className="font-bold text-lg text-[var(--color-text-primary)]">
        {formatCount(displayCount)} Comments
      </h3>

      {/* Add Comment Input */}
      {isAuthenticated ? (
        <form onSubmit={handlePost} className="flex gap-4 items-start">
          <Avatar src={user?.avatar} alt={user?.fullName} size="sm" className="mt-1 shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[40px] resize-none pb-8" // padding for button
            />
            {newComment.trim() && (
              <div className="flex justify-end gap-2 -mt-10 mr-2 relative z-10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setNewComment('')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={add.isPending}
                  disabled={!newComment.trim()}
                >
                  Comment
                </Button>
              </div>
            )}
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-xl bg-[var(--color-bg-surface)] text-sm text-[var(--color-text-secondary)] text-center">
          <Link to={ROUTES.LOGIN} className="text-[var(--color-accent)] font-medium hover:underline">
            Sign in
          </Link>{' '}
          to add a comment.
        </div>
      )}

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {isLoading && (
          <div className="flex flex-col gap-6">
            <CommentSkeleton />
            <CommentSkeleton />
          </div>
        )}

        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4 group">
            <Link to={ROUTES.CHANNEL(comment.owner?.username)} className="shrink-0 pt-1">
              <Avatar src={comment.owner?.avatar} alt={comment.owner?.fullName} size="sm" />
            </Link>
            
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  to={ROUTES.CHANNEL(comment.owner?.username)}
                  className="font-semibold text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  @{comment.owner?.username}
                </Link>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {formatRelativeDate(comment.createdAt)}
                </span>
              </div>

              {editingId === comment._id ? (
                <div className="mt-2 flex flex-col gap-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[40px]"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSaveEdit(comment._id)}
                      isLoading={update.isPending}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-primary)] mt-1 break-words whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}

              {/* Actions */}
              {!editingId && (
                <div className="flex items-center mt-2 -ml-3">
                  <LikeButton
                    type="comment"
                    targetId={comment._id}
                    parentId={videoId} // needed to invalidate comments query
                    isLiked={comment.isLiked}
                    likeCount={comment.likesCount || 0} // assuming backend provides this eventually, but if not, no issue
                  />
                </div>
              )}
            </div>

            {/* Menu (owner only) */}
            {user?._id === comment.owner?._id && !editingId && (
              <DropdownMenu
                trigger={
                  <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                }
                align="right"
              >
                <DropdownItem
                  icon={<Edit2 className="h-4 w-4" />}
                  onClick={() => {
                    setEditingId(comment._id)
                    setEditContent(comment.content)
                  }}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  danger
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => {
                    if (confirm('Delete this comment?')) {
                      remove.mutate(comment._id)
                    }
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            )}
          </div>
        ))}

        {hasNextPage && (
          <Button
            variant="ghost"
            className="w-full mt-2 text-[var(--color-accent)]"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            Show more comments
          </Button>
        )}
      </div>
    </div>
  )
}
