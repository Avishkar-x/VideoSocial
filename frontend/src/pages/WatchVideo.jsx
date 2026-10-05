import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getVideoById } from "../api/video.api"
import { toggleVideoLike } from "../api/like.api"
import { toggleSubscription } from "../api/subscription.api"
import { getChannelProfile } from "../api/user.api"
import { useAuth } from "../contexts/AuthContext"
import CommentSection from "../components/CommentSection"
import { ThumbsUp, Eye, Calendar, Loader2, VideoOff } from "lucide-react"

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

function formatCount(n) {
    if (!n && n !== 0) return "0"
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return String(n)
}

function WatchVideo() {
    const { videoId } = useParams()
    const { user } = useAuth()

    const [video, setVideo] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    // Like state — seeded from backend response
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [isLiking, setIsLiking] = useState(false)

    // Subscribe state — fetched from channel profile
    const [subscribed, setSubscribed] = useState(false)
    const [subscriberCount, setSubscriberCount] = useState(0)
    const [isSubscribing, setIsSubscribing] = useState(false)

    // Description expand/collapse
    const [descExpanded, setDescExpanded] = useState(false)

    useEffect(() => {
        if (!videoId) return
        const fetchVideo = async () => {
            setIsLoading(true)
            setError("")
            try {
                const res = await getVideoById(videoId)
                const v = res.data
                setVideo(v)
                setLiked(v.isLiked ?? false)
                setLikeCount(v.likes ?? 0)

                // Fetch channel profile to get subscriber count and isSubscribed
                if (v?.owner?.username) {
                    try {
                        const channelRes = await getChannelProfile(v.owner.username)
                        const channel = channelRes.data
                        setSubscriberCount(channel.subscribersCount ?? 0)
                        setSubscribed(channel.isSubscribed ?? false)
                    } catch {
                        // non-critical — channel profile optional
                    }
                }
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load video")
            } finally {
                setIsLoading(false)
            }
        }
        fetchVideo()
    }, [videoId])

    const handleLike = async () => {
        if (isLiking) return
        setIsLiking(true)
        // Optimistic update
        const wasLiked = liked
        setLiked(!wasLiked)
        setLikeCount(c => wasLiked ? c - 1 : c + 1)
        try {
            const res = await toggleVideoLike(videoId)
            // Sync with actual server response
            setLiked(res.data.liked)
            setLikeCount(c => {
                // Correct if server disagrees with optimistic
                if (res.data.liked !== !wasLiked) {
                    return wasLiked ? c + 1 : c - 1
                }
                return c
            })
        } catch {
            // Revert optimistic update on error
            setLiked(wasLiked)
            setLikeCount(c => wasLiked ? c + 1 : c - 1)
        } finally {
            setIsLiking(false)
        }
    }

    const handleSubscribe = async () => {
        if (isSubscribing || !video?.owner?._id) return
        setIsSubscribing(true)
        const wasSub = subscribed
        setSubscribed(!wasSub)
        setSubscriberCount(c => wasSub ? c - 1 : c + 1)
        try {
            const res = await toggleSubscription(video.owner._id)
            setSubscribed(res.data.subscribed)
        } catch {
            setSubscribed(wasSub)
            setSubscriberCount(c => wasSub ? c + 1 : c - 1)
        } finally {
            setIsSubscribing(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-text-secondary">
                <VideoOff className="h-10 w-10 text-text-muted" />
                <p className="text-sm">{error}</p>
            </div>
        )
    }

    if (!video) return null

    const isOwner = user?._id === video.owner?._id?.toString()

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">

            {/* Video Player */}
            <div className="w-full overflow-hidden rounded-xl bg-black aspect-video">
                <video
                    src={video.videoFile}
                    controls
                    autoPlay
                    className="w-full h-full"
                    poster={video.thumbnail}
                >
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Title */}
            <h1 className="text-lg font-bold text-text-primary leading-snug">
                {video.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                {/* Channel info + subscribe */}
                <div className="flex items-center gap-3">
                    <Link to={`/c/${video.owner?.username}`} className="shrink-0">
                        {video.owner?.avatar ? (
                            <img
                                src={video.owner.avatar}
                                alt={video.owner.fullName}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                                {video.owner?.fullName?.[0] || "?"}
                            </div>
                        )}
                    </Link>
                    <div className="flex flex-col">
                        <Link to={`/c/${video.owner?.username}`} className="text-sm font-semibold text-text-primary hover:text-accent transition-colors">
                            {video.owner?.fullName}
                        </Link>
                        <span className="text-xs text-text-muted">
                            {formatCount(subscriberCount)} subscribers
                        </span>
                    </div>

                    {/* Subscribe button — hide for own channel */}
                    {!isOwner && (
                        <button
                            onClick={handleSubscribe}
                            disabled={isSubscribing}
                            className={`ml-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors disabled:opacity-60
                                ${subscribed
                                    ? "bg-bg-elevated text-text-primary hover:bg-bg-elevated/80 border border-white/10"
                                    : "bg-text-primary text-bg-base hover:bg-text-primary/90"
                                }`}
                        >
                            {subscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    )}
                </div>

                {/* Like + stats */}
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 border
                            ${liked
                                ? "bg-accent/15 border-accent/50 text-accent"
                                : "bg-bg-elevated border-white/10 text-text-primary hover:bg-bg-elevated/80"
                            }`}
                    >
                        <ThumbsUp className={`h-4 w-4 ${liked ? "fill-accent" : ""}`} />
                        {formatCount(likeCount)}
                    </button>

                    <div className="flex items-center gap-1.5 text-sm text-text-muted">
                        <Eye className="h-4 w-4" />
                        <span>{formatCount(video.views)} views</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-text-muted">
                        <Calendar className="h-4 w-4" />
                        <span>{formatRelativeDate(video.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            {video.description && (
                <div className="rounded-xl bg-bg-surface p-4">
                    <p className={`text-sm text-text-secondary whitespace-pre-wrap leading-relaxed ${!descExpanded ? "line-clamp-3" : ""}`}>
                        {video.description}
                    </p>
                    {video.description.length > 120 && (
                        <button
                            onClick={() => setDescExpanded(e => !e)}
                            className="mt-2 text-xs font-semibold text-text-primary hover:text-accent transition-colors"
                        >
                            {descExpanded ? "Show less" : "Show more"}
                        </button>
                    )}
                </div>
            )}

            {/* Divider */}
            <div className="border-t border-white/5" />

            {/* Comments */}
            <CommentSection videoId={videoId} commentCount={video.comments ?? 0} />
        </div>
    )
}

export default WatchVideo
