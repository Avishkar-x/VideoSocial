import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllVideos } from "../api/video.api"
import VideoCard from "../components/VideoCard"
import { Loader2, VideoOff } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

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

function Home() {
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    const [videos, setVideos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState(null)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                
                const response = await getAllVideos({
                    page,
                    limit: 10,
                })

                console.log(response)
                setVideos(response.data.docs)
                setPagination(response.data)
            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                    "Failed to fetch videos"
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchVideos()
    }, [page])

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

    if (videos.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-text-secondary">
                <VideoOff className="h-10 w-10 text-text-muted" />
                <p className="text-sm">No videos found.</p>
            </div>
        )
    }

    // Normalise backend fields before handing to VideoCard
    const normalisedVideos = videos.map((v) => ({
        ...v,
        duration: formatDuration(v.duration),
        createdAt: formatRelativeDate(v.createdAt),
    }))

    return (
        <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">

            {/* Page heading */}
            <div>
                <h1 className="text-xl font-bold text-text-primary">Home</h1>
                <p className="mt-0.5 text-sm text-text-secondary">Videos for you</p>
            </div>

            {/* Video grid */}
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {normalisedVideos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>

            {/* Pagination */}
            {pagination && (pagination.hasPrevPage || pagination.hasNextPage) && (
                <div className="flex items-center justify-center gap-4 pt-2 pb-6">
                    <button
                        disabled={!pagination.hasPrevPage}
                        onClick={() => setPage(prev => prev - 1)}
                        className="rounded-lg border border-white/10 bg-bg-surface px-5 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-elevated disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        ← Previous
                    </button>

                    <span className="text-sm text-text-muted">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <button
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPage(prev => prev + 1)}
                        className="rounded-lg border border-white/10 bg-bg-surface px-5 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-elevated disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    )
}

export default Home
