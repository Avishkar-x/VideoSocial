import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useUserTweets, useTweetMutations } from '../hooks/useTweets'
import { useTweetLike } from '../hooks/useLike'
import { useAuth } from '../contexts/AuthContext'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import { DropdownMenu, DropdownItem } from '../components/ui/DropdownMenu'
import { Skeleton } from '../components/ui/Skeleton'
import { LikeButton } from '../components/common/LikeButton'
import { formatRelativeDate } from '../utils/formatDate'
import { MoreVertical, Edit2, Trash2 } from 'lucide-react'

export default function ChannelTweetsTab() {
  const { userId, isOwner } = useOutletContext()
  const { user: currentUser } = useAuth()
  const { data: response, isLoading } = useUserTweets(userId)
  const { add, update, remove } = useTweetMutations(userId)
  const tweets = response?.data?.data || []

  const [newTweet, setNewTweet] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  const handlePost = (e) => {
    e.preventDefault()
    if (!newTweet.trim()) return
    add.mutate(newTweet, { onSuccess: () => setNewTweet('') })
  }

  const handleSaveEdit = (tweetId) => {
    if (!editContent.trim()) return
    update.mutate({ tweetId, content: editContent }, { onSuccess: () => setEditingId(null) })
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Create Tweet (Owner only) */}
      {isOwner && (
        <form onSubmit={handlePost} className="flex gap-4 items-start bg-[var(--color-bg-surface)] p-4 rounded-xl border border-[var(--color-border-default)]">
          <Avatar src={currentUser?.avatar} alt={currentUser?.fullName} size="sm" className="mt-1 shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Textarea
              placeholder="What's on your mind?"
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
              className="min-h-[80px] bg-transparent border-none focus-visible:ring-0 p-0 text-base"
            />
            <div className="flex justify-end pt-2 border-t border-[var(--color-border-default)]">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={add.isPending}
                disabled={!newTweet.trim()}
                className="rounded-full px-6"
              >
                Post
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Tweet List */}
      <div className="flex flex-col gap-4">
        {isLoading && (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border-default)]">
              <Skeleton className="h-10 w-10 shrink-0" rounded="rounded-full" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))
        )}

        {!isLoading && tweets.length === 0 && (
          <div className="text-center py-10 text-[var(--color-text-secondary)]">
            This channel hasn't posted any tweets yet.
          </div>
        )}

        {tweets.map((tweet) => (
          <div key={tweet._id} className="flex gap-4 p-4 bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border-default)] group">
            <div className="shrink-0 pt-1">
              {/* Note: Backend currently doesn't populate owner details fully on getUserTweets, 
                  but we can fallback to currentUser avatar if it's our own tweet, 
                  or wait for backend fix. Assuming owner object has at least ID. */}
              <Avatar src={currentUser?._id === tweet.owner ? currentUser.avatar : null} alt="User" size="sm" />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                  {currentUser?._id === tweet.owner ? currentUser?.fullName : 'User'}
                </span>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {formatRelativeDate(tweet.createdAt)}
                </span>
              </div>

              {editingId === tweet._id ? (
                <div className="mt-2 flex flex-col gap-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[60px]"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={() => handleSaveEdit(tweet._id)} isLoading={update.isPending}>Save</Button>
                  </div>
                </div>
              ) : (
                <p className="text-base text-[var(--color-text-primary)] mt-2 whitespace-pre-wrap leading-relaxed">
                  {tweet.content}
                </p>
              )}

              {/* Actions */}
              {!editingId && (
                <div className="flex items-center mt-3 -ml-2">
                  <LikeButton
                    type="tweet"
                    targetId={tweet._id}
                    parentId={userId} // For query invalidation
                    isLiked={tweet.isLiked}
                    likeCount={tweet.likesCount || 0}
                  />
                </div>
              )}
            </div>

            {/* Menu (Owner only) */}
            {isOwner && !editingId && (
              <DropdownMenu
                trigger={
                  <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                }
                align="right"
              >
                <DropdownItem icon={<Edit2 className="h-4 w-4" />} onClick={() => { setEditingId(tweet._id); setEditContent(tweet.content) }}>Edit</DropdownItem>
                <DropdownItem danger icon={<Trash2 className="h-4 w-4" />} onClick={() => { if (confirm('Delete this tweet?')) remove.mutate(tweet._id) }}>Delete</DropdownItem>
              </DropdownMenu>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
