import { useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { useUserPlaylists, usePlaylistMutations } from '../hooks/usePlaylists'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { Plus, ListVideo, Trash2, Edit2 } from 'lucide-react'
import { formatRelativeDate } from '../utils/formatDate'
import { ROUTES } from '../lib/constants'
import { useForm } from 'react-hook-form'
import { cn } from '../utils/cn'

// ─── Playlist Form Modal ─────────────────────────────────────────────────────

function PlaylistFormModal({ existing, userId, onClose }) {
  const { create, update } = usePlaylistMutations(userId)
  const isEditing = !!existing

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: existing?.name ?? '',
      description: existing?.description ?? '',
    }
  })

  const onSubmit = (data) => {
    if (isEditing) {
      update.mutate({ playlistId: existing._id, data }, { onSuccess: onClose })
    } else {
      create.mutate(data, { onSuccess: onClose })
    }
  }

  const isPending = isEditing ? update.isPending : create.isPending

  return (
    <Modal isOpen onClose={onClose} title={isEditing ? 'Edit Playlist' : 'New Playlist'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="playlist-name"
          label="Name *"
          placeholder="My awesome playlist"
          error={errors.name?.message}
          autoFocus
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 1, message: 'Name cannot be empty' },
          })}
        />
        <Textarea
          id="playlist-description"
          label="Description *"
          placeholder="Describe your playlist"
          rows={3}
          error={errors.description?.message}
          {...register('description', {
            required: 'Description is required',
          })}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" isLoading={isPending}>
            {isEditing ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Channel Playlists Tab ───────────────────────────────────────────────────

export default function ChannelPlaylistsTab() {
  const { userId, isOwner } = useOutletContext()
  const { data: response, isLoading } = useUserPlaylists(userId)
  const { remove } = usePlaylistMutations(userId)
  const playlists = response?.data?.data ?? []

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleDelete = (playlist) => {
    if (confirm(`Delete playlist "${playlist.name}"?`)) {
      remove.mutate(playlist._id)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      {isOwner && (
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            New Playlist
          </Button>
        </div>
      )}

      {/* Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-video rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && playlists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <ListVideo className="h-12 w-12 text-[var(--color-text-secondary)] opacity-40" />
          <p className="text-[var(--color-text-primary)] font-semibold">No playlists yet</p>
          {isOwner && (
            <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Create First Playlist
            </Button>
          )}
        </div>
      )}

      {/* Grid */}
      {!isLoading && playlists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="flex flex-col gap-2 group">
              <Link
                to={ROUTES.PLAYLIST(playlist._id)}
                className="block relative aspect-video rounded-xl overflow-hidden bg-[var(--color-bg-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                {playlist.thumbnail ? (
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ListVideo className="h-10 w-10 text-[var(--color-text-secondary)] opacity-40" />
                  </div>
                )}
                {/* Video count badge */}
                <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-0.5 rounded font-medium">
                  {playlist.totalVideos} videos
                </div>
              </Link>

              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <Link
                    to={ROUTES.PLAYLIST(playlist._id)}
                    className="font-semibold text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors line-clamp-1"
                  >
                    {playlist.name}
                  </Link>
                  <span className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Created {formatRelativeDate(playlist.createdAt)}
                  </span>
                </div>

                {isOwner && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditing(playlist)}
                      aria-label="Edit playlist"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(playlist)}
                      className="text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10"
                      aria-label="Delete playlist"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {formOpen && (
        <PlaylistFormModal userId={userId} onClose={() => setFormOpen(false)} />
      )}
      {editing && (
        <PlaylistFormModal
          existing={editing}
          userId={userId}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
