import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getUserPlaylists, createPlaylist, deletePlaylist } from "../api/playlist.api"
import { useAuth } from "../contexts/AuthContext"
import { Loader2, ListVideo, Plus, Trash2, Film } from "lucide-react"

function MyPlaylists() {
    const { user } = useAuth()
    const [playlists, setPlaylists] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    // Create form
    const [showCreate, setShowCreate] = useState(false)
    const [newName, setNewName] = useState("")
    const [newDesc, setNewDesc] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [createError, setCreateError] = useState("")

    // Delete
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {
        if (!user?._id) return
        const fetch = async () => {
            try {
                const res = await getUserPlaylists(user._id)
                setPlaylists(res.data || [])
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load playlists")
            } finally {
                setIsLoading(false)
            }
        }
        fetch()
    }, [user?._id])

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!newName.trim() || !newDesc.trim()) {
            setCreateError("Name and description are required.")
            return
        }
        setIsCreating(true)
        setCreateError("")
        try {
            const res = await createPlaylist(newName.trim(), newDesc.trim())
            setPlaylists(prev => [{ ...res.data, totalVideos: 0, thumbnail: null }, ...prev])
            setNewName("")
            setNewDesc("")
            setShowCreate(false)
        } catch (err) {
            setCreateError(err?.response?.data?.message || "Failed to create playlist")
        } finally {
            setIsCreating(false)
        }
    }

    const handleDelete = async (playlistId) => {
        if (!window.confirm("Delete this playlist?")) return
        setDeletingId(playlistId)
        try {
            await deletePlaylist(playlistId)
            setPlaylists(prev => prev.filter(p => p._id !== playlistId))
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete playlist")
        } finally {
            setDeletingId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ListVideo className="h-5 w-5 text-text-secondary" />
                    <h1 className="text-xl font-bold text-text-primary">My Playlists</h1>
                </div>
                <button
                    onClick={() => setShowCreate(s => !s)}
                    className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    New Playlist
                </button>
            </div>

            {/* Create form */}
            {showCreate && (
                <form onSubmit={handleCreate} className="rounded-xl border border-white/5 bg-bg-surface p-5 flex flex-col gap-4">
                    <h2 className="text-sm font-semibold text-text-primary">Create new playlist</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        className="rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                    />
                    <textarea
                        placeholder="Description"
                        value={newDesc}
                        onChange={e => setNewDesc(e.target.value)}
                        rows={2}
                        className="resize-none rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                    />
                    {createError && <p className="text-xs text-destructive">{createError}</p>}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60 transition-colors"
                        >
                            {isCreating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCreate(false)}
                            className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-2 text-sm text-text-primary hover:bg-bg-elevated/80 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Playlist grid */}
            {playlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-24 text-text-secondary">
                    <ListVideo className="h-10 w-10 text-text-muted" />
                    <p className="text-sm">No playlists yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {playlists.map(pl => (
                        <div key={pl._id} className="group relative rounded-xl border border-white/5 bg-bg-surface overflow-hidden hover:border-accent/30 transition-colors">
                            {/* Thumbnail */}
                            <Link to={`/playlists/${pl._id}`} className="block relative aspect-video bg-bg-elevated">
                                {pl.thumbnail ? (
                                    <img src={pl.thumbnail} alt={pl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-text-muted">
                                        <Film className="h-8 w-8" />
                                        <span className="text-xs">{pl.totalVideos} videos</span>
                                    </div>
                                )}
                                {pl.thumbnail && (
                                    <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                                        {pl.totalVideos} videos
                                    </div>
                                )}
                            </Link>

                            {/* Info */}
                            <div className="p-3 flex items-start justify-between gap-2">
                                <Link to={`/playlists/${pl._id}`} className="flex flex-col gap-0.5 overflow-hidden">
                                    <p className="text-sm font-semibold text-text-primary line-clamp-1 group-hover:text-accent transition-colors">{pl.name}</p>
                                    <p className="text-xs text-text-muted line-clamp-1">{pl.description}</p>
                                </Link>
                                <button
                                    onClick={() => handleDelete(pl._id)}
                                    disabled={deletingId === pl._id}
                                    className="shrink-0 text-text-muted hover:text-destructive transition-colors disabled:opacity-50 p-1"
                                    title="Delete playlist"
                                >
                                    {deletingId === pl._id
                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                        : <Trash2 className="h-4 w-4" />
                                    }
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyPlaylists
