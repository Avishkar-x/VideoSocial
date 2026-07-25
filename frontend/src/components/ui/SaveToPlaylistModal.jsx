import { useState } from 'react'
import { Plus, Check, ListVideo } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { useUserPlaylists, usePlaylistMutations, useSaveToPlaylist } from '../../hooks/usePlaylists'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../utils/cn'

export function SaveToPlaylistModal({ videoId, isOpen, onClose }) {
  const { user } = useAuth()
  const { data: response, isLoading } = useUserPlaylists(user?._id)
  const { create } = usePlaylistMutations(user?._id)
  const { addVideo, removeVideo } = useSaveToPlaylist()

  const playlists = response?.data?.data ?? []
  
  const [showCreate, setShowCreate] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [savedPlaylistIds, setSavedPlaylistIds] = useState(new Set())

  if (!isOpen) return null

  const handleToggle = (playlist) => {
    // getUserPlaylists doesn't return the videos array, so we track locally.
    // Backend uses $addToSet so adding twice is idempotent.
    const alreadySaved = savedPlaylistIds.has(playlist._id)
    if (alreadySaved) {
      removeVideo.mutate({ videoId, playlistId: playlist._id }, {
        onSuccess: () => setSavedPlaylistIds(prev => { const s = new Set(prev); s.delete(playlist._id); return s })
      })
    } else {
      addVideo.mutate({ videoId, playlistId: playlist._id }, {
        onSuccess: () => setSavedPlaylistIds(prev => new Set([...prev, playlist._id]))
      })
    }
  }

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newPlaylistName.trim()) return
    create.mutate(
      { name: newPlaylistName, description: 'Created via quick save' },
      { 
        onSuccess: () => {
          setNewPlaylistName('')
          setShowCreate(false)
        }
      }
    )
  }


  return (
    <Modal isOpen onClose={onClose} title="Save video to...">
      <div className="flex flex-col gap-4">
        
        {isLoading ? (
          <div className="py-4 text-center text-sm text-[var(--color-text-secondary)]">Loading playlists...</div>
        ) : playlists.length === 0 ? (
          <div className="py-4 text-center text-sm text-[var(--color-text-secondary)]">
            You don't have any playlists yet.
          </div>
        ) : (
          <div className="max-h-[240px] overflow-y-auto flex flex-col gap-2 -mx-2 px-2 scrollbar-none">
            {playlists.map((playlist) => {
              const isSaved = savedPlaylistIds.has(playlist._id)
              const isProcessing = addVideo.isPending || removeVideo.isPending

              return (
                <button
                  key={playlist._id}
                  onClick={() => handleToggle(playlist)}
                  disabled={isProcessing}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-bg-surface-hover)] text-left transition-colors"
                >
                  <div className={cn(
                    "flex items-center justify-center h-5 w-5 rounded border shrink-0 transition-colors",
                    isSaved 
                      ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white" 
                      : "border-[var(--color-border-default)]"
                  )}>
                    {isSaved && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-primary)] truncate flex-1">
                    {playlist.name}
                  </span>
                </button>
              )
            })}
          </div>

        )}

        <div className="pt-2 border-t border-[var(--color-border-default)]">
          {showCreate ? (
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <Input
                placeholder="Enter playlist name..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={create.isPending} disabled={!newPlaylistName.trim()}>
                  Create
                </Button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors w-full p-2 rounded-lg hover:bg-[var(--color-bg-surface-hover)]"
            >
              <Plus className="h-4 w-4" />
              Create new playlist
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
