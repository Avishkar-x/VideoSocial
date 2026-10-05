import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, ListVideo, Loader2, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserPlaylists, addVideoToPlaylist } from '../api/playlist.api';

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return null
  const s = Math.floor(Number(seconds))
  if (isNaN(s)) return String(seconds)   // already formatted string e.g. "10:00"
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

function VideoCard({ video }) {
  const { user } = useAuth()

  // Safe defaults
  const title = video?.title || 'Video Title'
  const rawDuration = video?.duration
  const duration = typeof rawDuration === 'number' ? formatDuration(rawDuration) : (rawDuration || null)
  const views = video?.views || 0
  const createdAt = video?.createdAt || ''
  const channelName = video?.owner?.fullName || 'Channel Name'
  const username = video?.owner?.username || 'username'

  // Dropdown state
  const [menuOpen, setMenuOpen] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [playlistsLoading, setPlaylistsLoading] = useState(false)
  const [playlistsError, setPlaylistsError] = useState('')
  const [addingId, setAddingId] = useState(null)     // playlistId being added to
  const [addedId, setAddedId] = useState(null)       // playlistId just added (success flash)
  const [addError, setAddError] = useState('')

  const menuRef = useRef(null)

  // Close on click outside
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleMenuOpen = async (e) => {
    e.preventDefault()   // don't navigate if inside a Link
    e.stopPropagation()

    if (menuOpen) {
      setMenuOpen(false)
      return
    }

    setMenuOpen(true)
    setAddError('')
    setAddedId(null)

    // Fetch playlists only if not already loaded
    if (!user?._id) return
    setPlaylistsLoading(true)
    setPlaylistsError('')
    try {
      const res = await getUserPlaylists(user._id)
      setPlaylists(res.data || [])
    } catch (err) {
      setPlaylistsError(err?.response?.data?.message || 'Failed to load playlists')
    } finally {
      setPlaylistsLoading(false)
    }
  }

  const handleAddToPlaylist = async (e, playlistId) => {
    e.preventDefault()
    e.stopPropagation()
    if (addingId) return

    setAddingId(playlistId)
    setAddError('')
    try {
      await addVideoToPlaylist(video._id, playlistId)
      setAddedId(playlistId)
      // Auto-close after brief success flash
      setTimeout(() => {
        setMenuOpen(false)
        setAddedId(null)
      }, 900)
    } catch (err) {
      setAddError(err?.response?.data?.message || 'Failed to add to playlist')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="group flex flex-col gap-3">
      {/* Thumbnail */}
      <Link to={`/watch/${video?._id || '123'}`} className="relative aspect-video w-full overflow-hidden rounded-xl bg-bg-elevated">
        {video?.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5 transition-transform duration-300 group-hover:scale-105">
            <span className="text-text-muted">No Thumbnail</span>
          </div>
        )}
        {duration && (
          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {duration}
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex gap-3">
        {/* Avatar */}
        <Link to={`/c/${username}`} className="mt-1 h-9 w-9 shrink-0 overflow-hidden rounded-full bg-bg-elevated">
          {video?.owner?.avatar ? (
            <img src={video.owner.avatar} alt={channelName} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-accent/20" />
          )}
        </Link>

        {/* Text content */}
        <div className="flex flex-col overflow-hidden">
          <Link to={`/watch/${video?._id || '123'}`} className="line-clamp-2 text-sm font-semibold text-text-primary group-hover:text-accent transition-colors leading-tight">
            {title}
          </Link>

          <Link to={`/c/${username}`} className="mt-1 text-xs text-text-secondary hover:text-text-primary transition-colors">
            {channelName}
          </Link>

          <div className="flex items-center text-xs text-text-muted mt-0.5">
            <span>{views} views</span>
            {createdAt && <><span className="mx-1.5 text-[10px]">•</span><span>{createdAt}</span></>}
          </div>
        </div>

        {/* 3-dot menu */}
        <div className="relative ml-auto mt-1 shrink-0 self-start" ref={menuRef}>
          <button
            onClick={handleMenuOpen}
            className="text-text-secondary hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-white/10"
            title="Add to playlist"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-8 z-50 w-56 rounded-xl border border-white/10 bg-bg-surface shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/5">
                <ListVideo className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs font-semibold text-text-primary">Add to playlist</span>
              </div>

              {/* Error banner */}
              {addError && (
                <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-destructive bg-destructive/10">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {addError}
                </div>
              )}

              {/* Body */}
              <div className="max-h-52 overflow-y-auto py-1">
                {playlistsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-accent" />
                  </div>
                ) : playlistsError ? (
                  <p className="px-3 py-3 text-xs text-destructive">{playlistsError}</p>
                ) : playlists.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-text-muted">No playlists yet.</p>
                ) : (
                  playlists.map(pl => (
                    <button
                      key={pl._id}
                      onClick={(e) => handleAddToPlaylist(e, pl._id)}
                      disabled={!!addingId}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors disabled:opacity-60"
                    >
                      <span className="truncate text-left">{pl.name}</span>
                      {addingId === pl._id && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
                      {addedId === pl._id && <Check className="h-3.5 w-3.5 text-accent shrink-0" />}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoCard;
