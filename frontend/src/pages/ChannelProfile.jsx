import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getChannelProfile } from "../api/user.api"
import { toggleSubscription } from "../api/subscription.api"
import { getAllVideos } from "../api/video.api"
import { useAuth } from "../contexts/AuthContext"
import VideoCard from "../components/VideoCard"
import { Loader2, VideoOff, Users, History, ThumbsUp, ListVideo, LayoutDashboard, Upload, Settings } from "lucide-react"

function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return null
    const s = Math.floor(seconds)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${m}:${String(sec).padStart(2, '0')}`
}

function formatRelativeDate(dateStr) {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'just now'
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

function ChannelProfile() {
    const { username } = useParams()
    const { user } = useAuth()

    const [channel, setChannel] = useState(null)
    const [isLoadingChannel, setIsLoadingChannel] = useState(true)
    const [channelError, setChannelError] = useState("")

    const [subscribed, setSubscribed] = useState(false)
    const [subscriberCount, setSubscriberCount] = useState(0)
    const [isSubscribing, setIsSubscribing] = useState(false)

    const [videos, setVideos] = useState([])
    const [isLoadingVideos, setIsLoadingVideos] = useState(true)

    useEffect(() => {
        if (!username) return
        const fetchChannel = async () => {
            setIsLoadingChannel(true)
            setChannelError("")
            try {
                const res = await getChannelProfile(username)
                const c = res.data
                setChannel(c)
                setSubscribed(c.isSubscribed ?? false)
                setSubscriberCount(c.subscribersCount ?? 0)
            } catch (err) {
                setChannelError(err?.response?.data?.message || "Channel not found")
            } finally {
                setIsLoadingChannel(false)
            }
        }
        fetchChannel()
    }, [username])

    useEffect(() => {
        if (!channel?._id) return
        const fetchVideos = async () => {
            setIsLoadingVideos(true)
            try {
                const res = await getAllVideos({ userId: channel._id, limit: 20, page: 1, sortBy: "createdAt" })
                setVideos(res.data.docs || [])
            } catch {
                setVideos([])
            } finally {
                setIsLoadingVideos(false)
            }
        }
        fetchVideos()
    }, [channel?._id])

    const handleSubscribe = async () => {
        if (isSubscribing || !channel?._id) return
        setIsSubscribing(true)
        const wasSub = subscribed
        setSubscribed(!wasSub)
        setSubscriberCount(c => wasSub ? c - 1 : c + 1)
        try {
            const res = await toggleSubscription(channel._id)
            setSubscribed(res.data.subscribed)
        } catch {
            setSubscribed(wasSub)
            setSubscriberCount(c => wasSub ? c + 1 : c - 1)
        } finally {
            setIsSubscribing(false)
        }
    }

    if (isLoadingChannel) {
        return (
            <div className="flex flex-1 items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        )
    }

    if (channelError) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-text-secondary">
                <Users className="h-10 w-10 text-text-muted" />
                <p className="text-sm">{channelError}</p>
            </div>
        )
    }

    const isOwn = user?.username === username
    const normalisedVideos = videos.map(v => ({
        ...v,
        duration: formatDuration(v.duration),
        createdAt: formatRelativeDate(v.createdAt),
    }))

    return (
        <div className="flex flex-col">
            {/* Cover image — avatar is positioned relative to this wrapper */}
            <div className="relative">
                <div className="w-full aspect-[3/1] md:aspect-[4/1] lg:aspect-[5/1] max-h-64 sm:max-h-80 bg-bg-elevated overflow-hidden">
                    {channel.coverImage ? (
                        <img 
                            src={channel.coverImage} 
                            alt="Cover" 
                            className="w-full h-full object-cover object-center" 
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-accent/20 to-accent/5" />
                    )}
                </div>

                {/* Avatar — absolutely placed so it straddles the cover's bottom edge */}
                <div className="absolute left-4 sm:left-6 lg:left-8 bottom-0 translate-y-1/2 z-10
                                h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-bg-base overflow-hidden bg-bg-elevated shrink-0">
                    {channel.avatar ? (
                        <img src={channel.avatar} alt={channel.fullName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-accent text-3xl font-bold bg-accent/20">
                            {channel.fullName?.[0] || "?"}
                        </div>
                    )}
                </div>
            </div>

            {/* Channel info — always below cover; padding-top clears the avatar */}
            <div className="px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    {/* Name + stats */}
                    <div>
                        <h1 className="text-xl font-bold text-text-primary">{channel.fullName}</h1>
                        <p className="text-sm text-text-secondary">@{channel.username}</p>
                        <p className="text-sm text-text-muted mt-1 flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {formatCount(subscriberCount)} subscribers
                            <span className="mx-1">·</span>
                            {formatCount(channel.channelsSubscribedToCount)} subscriptions
                        </p>
                    </div>

                    {/* Subscribe / Edit */}
                    {!isOwn && (
                        <button
                            onClick={handleSubscribe}
                            disabled={isSubscribing}
                            className={`self-start rounded-full px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-60
                                ${subscribed
                                    ? "bg-bg-elevated text-text-primary border border-white/10 hover:bg-bg-elevated/80"
                                    : "bg-text-primary text-bg-base hover:bg-text-primary/90"
                                }`}
                        >
                            {subscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    )}

                    {isOwn && (
                        <Link
                            to="/account"
                            className="self-start rounded-full px-5 py-2 text-sm font-semibold border border-white/10 bg-bg-elevated text-text-primary hover:bg-bg-elevated/80 transition-colors"
                        >
                            Edit profile
                        </Link>
                    )}
                </div>
            </div>

            {/* Quick Navigation for Owner */}
            {isOwn && (
                <div className="px-4 sm:px-6 lg:px-8 pb-6">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Link to="/upload" className="flex items-center gap-2 rounded-lg bg-white/5 px-3 sm:px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors border border-white/5">
                            <Upload className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Upload</span>
                        </Link>
                        <Link to="/dashboard" className="flex items-center gap-2 rounded-lg bg-white/5 px-3 sm:px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors border border-white/5">
                            <LayoutDashboard className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                        <Link to="/playlists" className="flex items-center gap-2 rounded-lg bg-white/5 px-3 sm:px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors border border-white/5">
                            <ListVideo className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Playlists</span>
                        </Link>
                        <Link to="/history" className="flex items-center gap-2 rounded-lg bg-white/5 px-3 sm:px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors border border-white/5">
                            <History className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">History</span>
                        </Link>
                        <Link to="/liked" className="flex items-center gap-2 rounded-lg bg-white/5 px-3 sm:px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors border border-white/5">
                            <ThumbsUp className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Liked</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="border-t border-white/5" />

            {/* Videos */}
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
                <h2 className="text-base font-semibold text-text-primary">Videos</h2>

                {isLoadingVideos ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-accent" />
                    </div>
                ) : normalisedVideos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-text-secondary">
                        <VideoOff className="h-10 w-10 text-text-muted" />
                        <p className="text-sm">No videos yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {normalisedVideos.map(v => <VideoCard key={v._id} video={v} />)}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChannelProfile
