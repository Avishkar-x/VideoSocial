import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getPlaylistById, updatePlaylist, removeVideoFromPlaylist } from "../api/playlist.api"
import { useAuth } from "../contexts/AuthContext"
import { Loader2, ListVideo, Pencil, Trash2, X, Check, VideoOff } from "lucide-react"

function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return null
    const s = Math.floor(seconds)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${m}:${String(sec).padStart(2, '0')}`
}

function PlaylistDetail() {
    const { playlistId } = useParams()
    const { user } = useAuth()

    const [playlist, setPlaylist] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    // Edit mode
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState("")
    const [editDesc, setEditDesc] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Remove video
    const [removingId, setRemovingId] = useState(null)

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getPlaylistById(playlistId)
                setPlaylist(res.data)
                setEditName(res.data.name)
                setEditDesc(res.data.description)
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load playlist")
            } finally {
                setIsLoading(false)
            }
        }
        fetch()
    }, [playlistId])

    const handleSaveEdit = async () => {
        if (!editName.trim() || !editDesc.trim() || isSaving) return
        setIsSaving(true)
        try {
            const res = await updatePlaylist(playlistId, editName.trim(), editDesc.trim())
            setPlaylist(prev => ({ ...prev, name: res.data.name, description: res.data.description }))
            setIsEditing(false)
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to update playlist")
        } finally {
            setIsSaving(false)
        }
    }

    const handleRemoveVideo = async (videoId) => {
        if (!window.confirm("Remove this video from the playlist?")) return
        setRemovingId(videoId)
        try {
            await removeVideoFromPlaylist(videoId, playlistId)
            setPlaylist(prev => ({
                ...prev,
                videos: prev.videos.filter(v => v._id !== videoId)
            }))
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to remove video")
        } finally {
            setRemovingId(null)
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
                <ListVideo className="h-10 w-10 text-text-muted" />
                <p className="text-sm">{error}</p>
            </div>
        )
    }

    if (!playlist) return null

    const isOwner = user?._id === playlist.owner?.toString()
    const videos = playlist.videos || []

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">

            {/* Playlist header */}
            <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-bg-surface p-5">
                {isEditing ? (
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                        />
                        <textarea
                            value={editDesc}
                            onChange={e => setEditDesc(e.target.value)}
                            rows={2}
                            className="resize-none rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                        />
                        <div className="flex gap-2">
                            <button onClick={handleSaveEdit} disabled={isSaving} className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover disabled:opacity-50">
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
                            </button>
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text-primary">
                                <X className="h-4 w-4" /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <ListVideo className="h-5 w-5 text-accent" />
                                <h1 className="text-lg font-bold text-text-primary">{playlist.name}</h1>
                            </div>
                            <p className="text-sm text-text-secondary">{playlist.description}</p>
                            <p className="text-xs text-text-muted mt-1">{videos.length} video{videos.length !== 1 ? "s" : ""}</p>
                        </div>
                        {isOwner && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
                            >
                                <Pencil className="h-4 w-4" /> Edit
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Videos */}
            {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-text-secondary">
                    <VideoOff className="h-10 w-10 text-text-muted" />
                    <p className="text-sm">This playlist is empty.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {videos.map((video, index) => {
                        const dur = formatDuration(video.duration)
                        return (
                            <div key={video._id} className="group flex items-center gap-3 rounded-xl p-3 hover:bg-bg-surface transition-colors">
                                <span className="text-xs font-medium text-text-muted w-5 text-center shrink-0">
                                    {index + 1}
                                </span>

                                <Link to={`/watch/${video._id}`} className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-bg-elevated">
                                    {video.thumbnail ? (
                                        <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <VideoOff className="h-4 w-4 text-text-muted" />
                                        </div>
                                    )}
                                    {dur && (
                                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                                            {dur}
                                        </span>
                                    )}
                                </Link>

                                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                                    <Link to={`/watch/${video._id}`} className="text-sm font-semibold text-text-primary line-clamp-2 hover:text-accent transition-colors">
                                        {video.title}
                                    </Link>
                                    {video.owner && (
                                        <p className="text-xs text-text-secondary">{video.owner.fullName}</p>
                                    )}
                                    <p className="text-xs text-text-muted">{video.views} views</p>
                                </div>

                                {isOwner && (
                                    <button
                                        onClick={() => handleRemoveVideo(video._id)}
                                        disabled={removingId === video._id}
                                        className="shrink-0 text-text-muted hover:text-destructive transition-colors disabled:opacity-50 p-1 opacity-0 group-hover:opacity-100"
                                        title="Remove from playlist"
                                    >
                                        {removingId === video._id
                                            ? <Loader2 className="h-4 w-4 animate-spin" />
                                            : <Trash2 className="h-4 w-4" />
                                        }
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default PlaylistDetail
