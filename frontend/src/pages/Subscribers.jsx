import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getUserChannelSubscribers } from "../api/subscription.api"
import { useAuth } from "../contexts/AuthContext"
import { Loader2, Users } from "lucide-react"

function Subscribers() {
    const { user } = useAuth()
    const [subscribers, setSubscribers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchSubscribers = async () => {
            if (!user?._id) return
            try {
                const res = await getUserChannelSubscribers(user._id)
                setSubscribers(res.data || [])
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load subscribers")
            } finally {
                setIsLoading(false)
            }
        }
        fetchSubscribers()
    }, [user])

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
            <div>
                <h1 className="text-xl font-bold text-text-primary">Subscribers</h1>
                <p className="mt-0.5 text-sm text-text-secondary">People who have subscribed to your channel</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
            ) : error ? (
                <div className="rounded-xl border border-white/5 bg-bg-surface py-12 text-center text-sm text-destructive">
                    {error}
                </div>
            ) : subscribers.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-bg-surface py-16 text-text-secondary">
                    <Users className="h-10 w-10 text-text-muted" />
                    <p className="text-sm">You don't have any subscribers yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subscribers.map(sub => (
                        <div key={sub._id} className="flex items-center gap-4 rounded-xl border border-white/5 bg-bg-surface p-4 hover:bg-bg-elevated transition-colors">
                            <Link to={`/c/${sub.subscriber?.username}`} className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-bg-base border border-white/10">
                                {sub.subscriber?.avatar ? (
                                    <img src={sub.subscriber.avatar} alt={sub.subscriber.username} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-accent/20 text-accent font-semibold">
                                        {sub.subscriber?.fullName?.[0] || "?"}
                                    </div>
                                )}
                            </Link>
                            <div className="flex flex-col overflow-hidden">
                                <Link to={`/c/${sub.subscriber?.username}`} className="truncate font-semibold text-text-primary hover:text-accent transition-colors">
                                    {sub.subscriber?.fullName}
                                </Link>
                                <p className="truncate text-sm text-text-secondary">@{sub.subscriber?.username}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Subscribers
