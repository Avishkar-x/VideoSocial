import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getWatchHistory } from "../api/user.api"
import { Loader2, History, VideoOff } from "lucide-react"

function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return null
    const s = Math.floor(seconds)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${m}:${String(sec).padStart(2, '0')}`
}

function WatchHistory() {
    const [videos, setVideos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getWatchHistory()
                setVideos(res.data || [])
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load watch history")
            } finally {
                setIsLoading(false)
            }
        }
        fetch()
    }, [])

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

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-text-secondary" />
                <h1 className="text-xl font-bold text-text-primary">Watch History</h1>
            </div>

            {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-24 text-text-secondary">
                    <History className="h-10 w-10 text-text-muted" />
                    <p className="text-sm">Your watch history is empty.</p>
                    <Link to="/" className="mt-1 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors">
                        Browse videos
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {videos.map(video => {
                        const dur = formatDuration(video.duration)
                        return (
                            <Link
                                key={video._id}
                                to={`/watch/${video._id}`}
                                className="group flex gap-4 rounded-xl p-3 hover:bg-bg-surface transition-colors"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video h-20 sm:h-24 shrink-0 overflow-hidden rounded-lg bg-bg-elevated">
                                    {video.thumbnail ? (
                                        <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <VideoOff className="h-5 w-5 text-text-muted" />
                                        </div>
                                    )}
                                    {dur && (
                                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                                            {dur}
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-col gap-1 overflow-hidden">
                                    <p className="text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                                        {video.title}
                                    </p>
                                    {video.owner && (
                                        <p className="text-xs text-text-secondary">
                                            {video.owner.fullName}
                                        </p>
                                    )}
                                    <p className="text-xs text-text-muted">
                                        {video.views} views
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default WatchHistory
