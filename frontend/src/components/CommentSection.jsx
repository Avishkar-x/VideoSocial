import { useEffect, useState } from "react"
import { getVideoComments, addComment, updateComment, deleteComment } from "../api/comment.api"
import { useAuth } from "../contexts/AuthContext"
import { Loader2, MessageSquare, Send, Pencil, Trash2, X, Check } from "lucide-react"

function formatRelativeDate(dateStr) {
    if (!dateStr) return ""
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months}mo ago`
    return `${Math.floor(months / 12)}y ago`
}

function CommentSection({ videoId, commentCount }) {
    const { user } = useAuth()

    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState(null)

    // New comment
    const [newContent, setNewContent] = useState("")
    const [isPosting, setIsPosting] = useState(false)
    const [postError, setPostError] = useState("")

    // Edit state
    const [editingId, setEditingId] = useState(null)
    const [editContent, setEditContent] = useState("")
    const [isSavingEdit, setIsSavingEdit] = useState(false)

    // Delete state
    const [deletingId, setDeletingId] = useState(null)

    const fetchComments = async (pageNum = 1) => {
        setIsLoading(true)
        setError("")
        try {
            const res = await getVideoComments(videoId, { page: pageNum, limit: 10 })
            const data = res.data
            if (pageNum === 1) {
                setComments(data.docs)
            } else {
                setComments(prev => [...prev, ...data.docs])
            }
            setPagination(data)
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load comments")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setComments([])
        setPage(1)
        fetchComments(1)
    }, [videoId])

    const handlePost = async (e) => {
        e.preventDefault()
        if (!newContent.trim() || isPosting) return
        setIsPosting(true)
        setPostError("")
        try {
            const res = await addComment(videoId, newContent.trim())
            // Backend returns raw comment (owner is ObjectId, not populated).
            // Inject current user as owner object for immediate UI display.
            const newComment = {
                ...res.data,
                owner: {
                    _id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    avatar: user.avatar,
                }
            }
            setComments(prev => [newComment, ...prev])
            setNewContent("")
        } catch (err) {
            setPostError(err?.response?.data?.message || "Failed to post comment")
        } finally {
            setIsPosting(false)
        }
    }

    const startEdit = (comment) => {
        setEditingId(comment._id)
        setEditContent(comment.content)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditContent("")
    }

    const saveEdit = async (commentId) => {
        if (!editContent.trim() || isSavingEdit) return
        setIsSavingEdit(true)
        try {
            await updateComment(commentId, editContent.trim())
            setComments(prev =>
                prev.map(c =>
                    c._id === commentId ? { ...c, content: editContent.trim() } : c
                )
            )
            cancelEdit()
        } catch (err) {
            // Show error inline — could improve UX here
            alert(err?.response?.data?.message || "Failed to update comment")
        } finally {
            setIsSavingEdit(false)
        }
    }

    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return
        setDeletingId(commentId)
        try {
            await deleteComment(commentId)
            setComments(prev => prev.filter(c => c._id !== commentId))
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete comment")
        } finally {
            setDeletingId(null)
        }
    }

    const loadMore = () => {
        const nextPage = page + 1
        setPage(nextPage)
        fetchComments(nextPage)
    }

    const displayCount = pagination?.totalDocs ?? commentCount

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-text-secondary" />
                <h2 className="text-base font-semibold text-text-primary">
                    {displayCount} {displayCount === 1 ? "Comment" : "Comments"}
                </h2>
            </div>

            {/* Add comment */}
            <form onSubmit={handlePost} className="flex gap-3">
                {user?.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="h-9 w-9 rounded-full object-cover shrink-0" />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-sm shrink-0">
                        {user?.fullName?.[0] || "?"}
                    </div>
                )}
                <div className="flex flex-1 flex-col gap-2">
                    <textarea
                        value={newContent}
                        onChange={e => setNewContent(e.target.value)}
                        placeholder="Add a comment…"
                        rows={2}
                        className="w-full resize-none rounded-lg border border-white/10 bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                    />
                    {postError && <p className="text-xs text-destructive">{postError}</p>}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!newContent.trim() || isPosting}
                            className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPosting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                            Post
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments list */}
            {isLoading && comments.length === 0 ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
            ) : error ? (
                <p className="text-sm text-text-muted text-center py-4">{error}</p>
            ) : comments.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No comments yet. Be the first!</p>
            ) : (
                <div className="flex flex-col gap-5">
                    {comments.map(comment => {
                        const isOwner = user?._id === comment.owner?._id?.toString()
                        const isEditing = editingId === comment._id
                        const isDeleting = deletingId === comment._id

                        return (
                            <div key={comment._id} className="flex gap-3">
                                {comment.owner?.avatar ? (
                                    <img src={comment.owner.avatar} alt={comment.owner.fullName} className="h-8 w-8 rounded-full object-cover shrink-0 mt-0.5" />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-semibold shrink-0 mt-0.5">
                                        {comment.owner?.fullName?.[0] || "?"}
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-text-primary">
                                            {comment.owner?.fullName || comment.owner?.username}
                                        </span>
                                        <span className="text-xs text-text-muted">
                                            {formatRelativeDate(comment.createdAt)}
                                        </span>
                                    </div>

                                    {isEditing ? (
                                        <div className="flex flex-col gap-2">
                                            <textarea
                                                value={editContent}
                                                onChange={e => setEditContent(e.target.value)}
                                                rows={2}
                                                className="w-full resize-none rounded-lg border border-white/10 bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => saveEdit(comment._id)}
                                                    disabled={isSavingEdit || !editContent.trim()}
                                                    className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover disabled:opacity-50"
                                                >
                                                    <Check className="h-3.5 w-3.5" /> Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text-primary"
                                                >
                                                    <X className="h-3.5 w-3.5" /> Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                                            {comment.content}
                                        </p>
                                    )}

                                    {/* Owner actions */}
                                    {isOwner && !isEditing && (
                                        <div className="flex gap-3 mt-1">
                                            <button
                                                onClick={() => startEdit(comment)}
                                                className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors"
                                            >
                                                <Pencil className="h-3 w-3" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                disabled={isDeleting}
                                                className="flex items-center gap-1 text-xs text-text-muted hover:text-destructive transition-colors disabled:opacity-50"
                                            >
                                                {isDeleting
                                                    ? <Loader2 className="h-3 w-3 animate-spin" />
                                                    : <Trash2 className="h-3 w-3" />
                                                }
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {/* Load more */}
                    {pagination?.hasNextPage && (
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={loadMore}
                                disabled={isLoading}
                                className="rounded-lg border border-white/10 bg-bg-surface px-5 py-2 text-sm font-medium text-text-primary hover:bg-bg-elevated disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load more comments"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CommentSection
