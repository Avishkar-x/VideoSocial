import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { getChannelStats, getChannelVideos } from "../api/dashboard.api"
import { updateVideo, deleteVideo, togglePublishStatus } from "../api/video.api"
import { Loader2, Eye, ThumbsUp, MessageSquare, Users, Video, TrendingUp, ToggleLeft, ToggleRight, MoreVertical, Pencil, Trash2, EyeOff, Eye as EyeIcon, X, Image as ImageIcon } from "lucide-react"

function formatCount(n) {
    if (!n && n !== 0) return "0"
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return String(n)
}

function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return "0:00"
    const s = Math.floor(seconds)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${m}:${String(sec).padStart(2, '0')}`
}

function StatCard({ icon: Icon, label, value, color = "text-accent" }) {
    return (
        <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-bg-surface p-4">
            <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    )
}

function Dashboard() {
    const [stats, setStats] = useState(null)
    const [videos, setVideos] = useState([])
    const [isLoadingStats, setIsLoadingStats] = useState(true)
    const [isLoadingVideos, setIsLoadingVideos] = useState(true)
    const [statsError, setStatsError] = useState("")

    // Video action states
    const [openMenuId, setOpenMenuId] = useState(null)
    const [editingVideo, setEditingVideo] = useState(null)
    const [editForm, setEditForm] = useState({ title: "", description: "" })
    const [editThumbnail, setEditThumbnail] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [editError, setEditError] = useState("")
    const [deletingId, setDeletingId] = useState(null)
    const [togglingId, setTogglingId] = useState(null)

    const menuRef = useRef(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getChannelStats()
                setStats(res.data)
            } catch (err) {
                setStatsError(err?.response?.data?.message || "Failed to load stats")
            } finally {
                setIsLoadingStats(false)
            }
        }

        const fetchVideos = async () => {
            try {
                const res = await getChannelVideos()
                setVideos(res.data || [])
            } catch {
                setVideos([])
            } finally {
                setIsLoadingVideos(false)
            }
        }

        fetchStats()
        fetchVideos()
    }, [])

    // Close menu on click outside
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const handleTogglePublish = async (videoId) => {
        setOpenMenuId(null)
        setTogglingId(videoId)
        try {
            await togglePublishStatus(videoId)
            setVideos(prev => prev.map(v => v._id === videoId ? { ...v, isPublished: !v.isPublished } : v))
            getChannelStats().then(res => setStats(res.data)).catch(()=>{})
        } catch (err) {
            console.error(err)
            alert(err?.response?.data?.message || "Failed to toggle status")
        } finally {
            setTogglingId(null)
        }
    }

    const handleDelete = async (videoId) => {
        setOpenMenuId(null)
        if (!window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) return
        
        setDeletingId(videoId)
        try {
            await deleteVideo(videoId)
            setVideos(prev => prev.filter(v => v._id !== videoId))
            getChannelStats().then(res => setStats(res.data)).catch(()=>{})
        } catch (err) {
            console.error(err)
            alert(err?.response?.data?.message || "Failed to delete video")
        } finally {
            setDeletingId(null)
        }
    }

    const openEditModal = (video) => {
        setOpenMenuId(null)
        setEditingVideo(video)
        setEditForm({ title: video.title, description: video.description })
        setEditThumbnail(null)
        setEditError("")
    }

    const closeEditModal = () => {
        setEditingVideo(null)
        setEditForm({ title: "", description: "" })
        setEditThumbnail(null)
        setEditError("")
    }

    const handleSaveEdit = async (e) => {
        e.preventDefault()
        if (!editForm.title.trim()) {
            setEditError("Title is required")
            return
        }

        setIsSaving(true)
        setEditError("")

        const formData = new FormData()
        formData.append("title", editForm.title)
        formData.append("description", editForm.description)
        if (editThumbnail) {
            formData.append("thumbnail", editThumbnail)
        }

        try {
            const res = await updateVideo(editingVideo._id, formData)
            setVideos(prev => prev.map(v => v._id === editingVideo._id ? res.data : v))
            closeEditModal()
        } catch (err) {
            console.error(err)
            setEditError(err?.response?.data?.message || "Failed to update video")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
            <div>
                <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
                <p className="mt-0.5 text-sm text-text-secondary">Your channel overview</p>
            </div>

            {/* Stats */}
            {isLoadingStats ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
            ) : statsError ? (
                <p className="text-sm text-destructive">{statsError}</p>
            ) : stats ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    <StatCard icon={Video} label="Total Videos" value={formatCount(stats.totalVideos)} />
                    <StatCard icon={Eye} label="Total Views" value={formatCount(stats.totalViews)} color="text-sky-400" />
                    <StatCard icon={ThumbsUp} label="Total Likes" value={formatCount(stats.totalLikes)} color="text-pink-400" />
                    <StatCard icon={Users} label="Subscribers" value={formatCount(stats.totalSubscribers)} color="text-emerald-400" />
                    <StatCard icon={MessageSquare} label="Comments" value={formatCount(stats.totalComments)} color="text-amber-400" />
                    <StatCard icon={TrendingUp} label="Avg. Views" value={formatCount(Math.round(stats.averageViews))} color="text-violet-400" />
                    <StatCard icon={ToggleRight} label="Published" value={formatCount(stats.publishedVideos)} color="text-emerald-400" />
                    <StatCard icon={ToggleLeft} label="Unpublished" value={formatCount(stats.unpublishedVideos)} color="text-text-muted" />
                </div>
            ) : null}

            {/* Videos table */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-text-primary">Your Videos</h2>
                    <Link
                        to="/upload"
                        className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
                    >
                        + Upload
                    </Link>
                </div>

                {isLoadingVideos ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-accent" />
                    </div>
                ) : videos.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-bg-surface py-16">
                        <Video className="h-10 w-10 text-text-muted" />
                        <p className="text-sm text-text-secondary">No videos yet.</p>
                        <Link to="/upload" className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors">
                            Upload your first video
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-white/5 pb-24">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 bg-bg-surface text-left">
                                    <th className="px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wide">Video</th>
                                    <th className="px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wide">Status</th>
                                    <th className="px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wide text-right">Views</th>
                                    <th className="px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wide text-right">Duration</th>
                                    <th className="px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wide text-right w-16">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {videos.map(v => (
                                    <tr key={v._id} className="border-b border-white/5 hover:bg-bg-surface transition-colors">
                                        <td className="px-4 py-3">
                                            <Link to={`/watch/${v._id}`} className="flex items-center gap-3 group">
                                                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-bg-elevated">
                                                    {v.thumbnail ? (
                                                        <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <Video className="h-4 w-4 text-text-muted" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="line-clamp-2 font-medium text-text-primary group-hover:text-accent transition-colors max-w-xs">
                                                    {v.title}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                                                ${v.isPublished
                                                    ? "bg-success/10 text-success"
                                                    : "bg-white/5 text-text-muted"
                                                }`}>
                                                {v.isPublished ? "Published" : "Private"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-text-secondary">{formatCount(v.views)}</td>
                                        <td className="px-4 py-3 text-right text-text-secondary">{formatDuration(v.duration)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="relative inline-block text-left" ref={openMenuId === v._id ? menuRef : null}>
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === v._id ? null : v._id)}
                                                    className="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-bg-elevated transition-colors"
                                                    aria-label="Options"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                                {openMenuId === v._id && (
                                                    <div className="absolute right-0 top-10 mt-1 w-48 rounded-lg bg-bg-surface border border-white/10 shadow-xl z-[100] py-1 overflow-hidden">
                                                        <button
                                                            onClick={() => openEditModal(v)}
                                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                                                        >
                                                            <Pencil className="h-4 w-4" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleTogglePublish(v._id)}
                                                            disabled={togglingId === v._id}
                                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors disabled:opacity-50"
                                                        >
                                                            {togglingId === v._id ? <Loader2 className="h-4 w-4 animate-spin" /> : v.isPublished ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />} 
                                                            {v.isPublished ? "Unpublish" : "Publish"}
                                                        </button>
                                                        <div className="my-1 border-t border-white/5"></div>
                                                        <button
                                                            onClick={() => handleDelete(v._id)}
                                                            disabled={deletingId === v._id}
                                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                                                        >
                                                            {deletingId === v._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingVideo && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-bg-surface p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-text-primary">Edit Video</h3>
                            <button onClick={closeEditModal} className="rounded-full p-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-primary transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveEdit} className="flex flex-col gap-5">
                            {editError && (
                                <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                                    {editError}
                                </div>
                            )}
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-secondary">Title *</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                    className="rounded-lg border border-white/10 bg-bg-base p-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                    placeholder="Video title"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-secondary">Description</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    rows={4}
                                    className="rounded-lg border border-white/10 bg-bg-base p-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none transition-all"
                                    placeholder="Video description"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-secondary">Thumbnail</label>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-bg-base">
                                        {editThumbnail ? (
                                            <img src={URL.createObjectURL(editThumbnail)} className="h-full w-full object-cover" alt="Preview" />
                                        ) : editingVideo.thumbnail ? (
                                            <img src={editingVideo.thumbnail} className="h-full w-full object-cover" alt="Current" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <ImageIcon className="h-6 w-6 text-text-muted" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="thumbnail-upload"
                                            onChange={e => setEditThumbnail(e.target.files[0])}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="thumbnail-upload"
                                            className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-bg-elevated px-4 py-2 text-sm font-medium text-text-primary hover:bg-white/10 transition-colors border border-white/5"
                                        >
                                            Change Thumbnail
                                        </label>
                                        <p className="text-xs text-text-muted mt-1">Leave empty to keep current</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="rounded-full px-5 py-2 text-sm font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-2 rounded-full bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60 transition-colors shadow-lg shadow-accent/20"
                                >
                                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
