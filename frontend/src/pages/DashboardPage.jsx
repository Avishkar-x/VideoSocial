import { useState, memo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye, ThumbsUp, MessageSquare, Users, Video, TrendingUp,
  Edit2, Trash2, ToggleLeft, ToggleRight, Plus, CheckCircle, XCircle
} from 'lucide-react'
import { useDashboardStats, useDashboardVideos } from '../hooks/useDashboard'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Skeleton } from '../components/ui/Skeleton'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Input'
import { formatCount } from '../utils/formatCount'
import { formatRelativeDate } from '../utils/formatDate'
import { formatDuration } from '../utils/formatDuration'
import { ROUTES, QUERY_KEYS } from '../lib/constants'
import { togglePublishStatus, deleteVideo, updateVideo } from '../api/video.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { cn } from '../utils/cn'

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, isLoading }) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]">
      <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center shrink-0', color)}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wide">{label}</span>
        {isLoading ? (
          <Skeleton className="h-7 w-20 mt-1" />
        ) : (
          <span className="text-2xl font-bold text-[var(--color-text-primary)]">{formatCount(value ?? 0)}</span>
        )}
      </div>
    </div>
  )
}

// ─── Edit Video Modal ────────────────────────────────────────────────────────

function EditVideoModal({ video, onClose }) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { title: video.title, description: video.description ?? '' }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, description }) => {
      const fd = new FormData()
      if (title !== video.title) fd.append('title', title)
      if (description !== (video.description ?? '')) fd.append('description', description)
      return updateVideo(video._id, fd)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboardVideos })
      toast.success('Video updated.')
      onClose()
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Failed to update video.'),
  })

  const onSubmit = (data) => {
    const titleChanged = data.title !== video.title;
    const descChanged = data.description !== (video.description ?? '');
    
    if (!titleChanged && !descChanged) {
      toast.error('No changes made.');
      return;
    }
    
    if (descChanged && data.description.trim().length < 10) {
      toast.error('Description must be at least 10 characters.');
      return;
    }
    
    mutate(data);
  }

  return (
    <Modal isOpen onClose={onClose} title="Edit Video">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="edit-title"
          label="Title"
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />
        <Textarea
          id="edit-description"
          label="Description"
          rows={4}
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isPending}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Video Row ───────────────────────────────────────────────────────────────

const VideoRow = memo(function VideoRow({ video }) {
  const queryClient = useQueryClient()
  const [editOpen, setEditOpen] = useState(false)

  const togglePublish = useMutation({
    mutationFn: () => togglePublishStatus(video._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboardVideos })
      toast.success(video.isPublished ? 'Video unpublished.' : 'Video published.')
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Failed to toggle status.'),
  })

  const doDelete = useMutation({
    mutationFn: () => deleteVideo(video._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboardVideos })
      toast.success('Video deleted.')
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Failed to delete video.'),
  })

  const handleDelete = () => {
    if (confirm(`Delete "${video.title}"? This cannot be undone.`)) {
      doDelete.mutate()
    }
  }

  return (
    <>
      <tr className="border-b border-[var(--color-border-default)] hover:bg-[var(--color-bg-surface-hover)] transition-colors">
        {/* Thumbnail + Title */}
        <td className="p-4">
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className="relative h-16 w-28 shrink-0 rounded-lg overflow-hidden bg-[var(--color-bg-surface-hover)]">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                {formatDuration(video.duration)}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <Link
                to={ROUTES.WATCH(video._id)}
                className="font-semibold text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent)] line-clamp-2 transition-colors"
              >
                {video.title}
              </Link>
              <span className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {formatRelativeDate(video.createdAt)}
              </span>
            </div>
          </div>
        </td>

        {/* Status */}
        <td className="p-4">
          <div className={cn(
            'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
            video.isPublished
              ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
              : 'bg-[var(--color-text-secondary)]/15 text-[var(--color-text-secondary)]'
          )}>
            {video.isPublished
              ? <><CheckCircle className="h-3 w-3" /> Published</>
              : <><XCircle className="h-3 w-3" /> Draft</>
            }
          </div>
        </td>

        {/* Views */}
        <td className="p-4 text-sm text-[var(--color-text-secondary)] text-right">
          {formatCount(video.views)}
        </td>

        {/* Actions */}
        <td className="p-4">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => togglePublish.mutate()}
              isLoading={togglePublish.isPending}
              aria-label={video.isPublished ? 'Unpublish video' : 'Publish video'}
              title={video.isPublished ? 'Unpublish' : 'Publish'}
            >
              {video.isPublished
                ? <ToggleRight className="h-4 w-4 text-[var(--color-success)]" />
                : <ToggleLeft className="h-4 w-4 text-[var(--color-text-secondary)]" />
              }
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setEditOpen(true)}
              aria-label="Edit video"
              title="Edit"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDelete}
              isLoading={doDelete.isPending}
              aria-label="Delete video"
              title="Delete"
              className="text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>

      {editOpen && <EditVideoModal video={video} onClose={() => setEditOpen(false)} />}
    </>
  )
})

// ─── Dashboard Page ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: statsRes, isLoading: statsLoading } = useDashboardStats()
  const { data: videosRes, isLoading: videosLoading } = useDashboardVideos()

  const stats = statsRes?.data?.data ?? {}
  const videos = videosRes?.data?.data ?? []

  const statCards = [
    { icon: Video,       label: 'Total Videos',   value: stats.totalVideos,      color: 'bg-[var(--color-accent)]' },
    { icon: Eye,         label: 'Total Views',     value: stats.totalViews,       color: 'bg-[var(--color-info)]' },
    { icon: ThumbsUp,    label: 'Total Likes',     value: stats.totalLikes,       color: 'bg-[var(--color-success)]' },
    { icon: MessageSquare, label: 'Comments',      value: stats.totalComments,    color: 'bg-orange-500' },
    { icon: Users,       label: 'Subscribers',     value: stats.totalSubscribers, color: 'bg-purple-500' },
    { icon: TrendingUp,  label: 'Avg Views/Video', value: Math.round(stats.averageViews ?? 0), color: 'bg-pink-500' },
  ]

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar} alt={user?.fullName} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Channel Dashboard
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">@{user?.username}</p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.UPLOAD)}
        >
          <Plus className="h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} isLoading={statsLoading} />
        ))}
      </div>

      {/* Published/Draft breakdown */}
      {!statsLoading && stats.totalVideos > 0 && (
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <CheckCircle className="h-4 w-4 text-[var(--color-success)]" />
            <span>{formatCount(stats.publishedVideos)} published</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <XCircle className="h-4 w-4" />
            <span>{formatCount(stats.unpublishedVideos)} drafts</span>
          </div>
        </div>
      )}

      {/* Video Management Table */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Your Videos</h2>

        {videosLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]">
                <Skeleton className="h-16 w-28 shrink-0 rounded-lg" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Video className="h-12 w-12 text-[var(--color-text-secondary)] opacity-40 mb-4" />
            <p className="text-[var(--color-text-primary)] font-semibold">No videos yet</p>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">Upload your first video to get started.</p>
            <Button variant="primary" className="mt-4" onClick={() => navigate(ROUTES.UPLOAD)}>
              <Plus className="h-4 w-4" />
              Upload Video
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border-default)]">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
                <tr>
                  <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Video</th>
                  <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Status</th>
                  <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide text-right">Views</th>
                  <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <VideoRow key={video._id} video={video} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
