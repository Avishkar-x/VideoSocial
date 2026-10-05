import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getAllVideos } from "../api/video.api"
import VideoCard from "../components/VideoCard"
import { Loader2, VideoOff } from "lucide-react"

// Converts duration in seconds (number) to "M:SS" or "H:MM:SS"
function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return null
    const s = Math.floor(seconds)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) {
        return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    }
    return `${m}:${String(sec).padStart(2, '0')}`
}

// Converts ISO date string to a relative string like "3 days ago"
function formatRelativeDate(dateStr) {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`
    return `${Math.floor(months / 12)} year${Math.floor(months / 12) !== 1 ? 's' : ''} ago`
}

function Search() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("query") || ""

    const [videos, setVideos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await getAllVideos({
                    page: 1,
                    limit: 10,
                    query
                })

                setVideos(response.data.docs)
            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                    "Failed to fetch search results"
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchVideos()
    }, [query])

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

    const normalisedVideos = videos.map((v) => ({
        ...v,
        duration: formatDuration(v.duration),
        createdAt: formatRelativeDate(v.createdAt),
    }))

    return (
        <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">

            {/* Page heading */}
            <div>
                <h1 className="text-xl font-bold text-text-primary">Search Results</h1>
                <p className="mt-0.5 text-sm text-text-secondary">
                    {query ? `Results for "${query}"` : "All videos"}
                </p>
            </div>

            {/* Video grid or empty state */}
            {normalisedVideos.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-text-secondary">
                    <VideoOff className="h-10 w-10 text-text-muted" />
                    <p className="text-sm">No videos found for "{query}".</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {normalisedVideos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Search