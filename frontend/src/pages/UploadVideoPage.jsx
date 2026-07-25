import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { UploadCloud, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { publishVideo } from '../api/video.api'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { FileInput } from '../components/ui/FileInput'
import { ROUTES, FILE_LIMITS, QUERY_KEYS } from '../lib/constants'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { cn } from '../utils/cn'

// ─── Upload States ────────────────────────────────────────────────────────────

const STATES = {
  FORM: 'form',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
}

export default function UploadVideoPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [uploadState, setUploadState] = useState(STATES.FORM)
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      videoFile: null,
      thumbnail: null,
      isPublished: true,
    },
  })

  const onSubmit = useCallback(async (data) => {
    if (!data.videoFile) {
      toast.error('Please select a video file.')
      return
    }
    if (!data.thumbnail) {
      toast.error('Please select a thumbnail image.')
      return
    }

    const formData = new FormData()
    formData.append('title', data.title.trim())
    formData.append('description', data.description.trim())
    formData.append('videoFile', data.videoFile)
    formData.append('thumbnail', data.thumbnail)
    formData.append('isPublished', String(data.isPublished))

    setUploadState(STATES.UPLOADING)
    setProgress(0)

    try {
      await publishVideo(formData, {
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setProgress(pct)
        },
      })

      // Invalidate dashboard so stats/table refresh
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboardVideos })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboardStats })
      // Also invalidate home feed
      queryClient.invalidateQueries({ queryKey: ['videos'] })

      setUploadState(STATES.SUCCESS)
    } catch (err) {
      setErrorMsg(err?.response?.data?.message ?? 'Upload failed. Please try again.')
      setUploadState(STATES.ERROR)
    }
  }, [queryClient])

  // ── Uploading State ──────────────────────────────────────────────────────
  if (uploadState === STATES.UPLOADING) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <UploadCloud className="h-16 w-16 text-[var(--color-accent)] animate-bounce" />
        <div className="flex flex-col gap-2 max-w-sm w-full">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Uploading your video…</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Please don't close this page.</p>
          {/* Progress bar */}
          <div className="w-full bg-[var(--color-bg-surface)] rounded-full h-2.5 mt-4 overflow-hidden border border-[var(--color-border-default)]">
            <div
              className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-[var(--color-accent)]">{progress}%</span>
        </div>
      </div>
    )
  }

  // ── Success State ────────────────────────────────────────────────────────
  if (uploadState === STATES.SUCCESS) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <CheckCircle className="h-16 w-16 text-[var(--color-success)]" />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Video uploaded successfully!</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Your video is now being processed and will be available shortly.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD)}>
            Go to Dashboard
          </Button>
          <Button variant="primary" onClick={() => { setUploadState(STATES.FORM); setProgress(0) }}>
            Upload Another
          </Button>
        </div>
      </div>
    )
  }

  // ── Error State ──────────────────────────────────────────────────────────
  if (uploadState === STATES.ERROR) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <AlertCircle className="h-16 w-16 text-[var(--color-destructive)]" />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Upload Failed</h2>
          <p className="text-sm text-[var(--color-destructive)]">{errorMsg}</p>
        </div>
        <Button variant="primary" onClick={() => { setUploadState(STATES.FORM); setProgress(0) }}>
          Try Again
        </Button>
      </div>
    )
  }

  // ── Form State ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Upload Video</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Share your video with the world</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Video File */}
        <div className="bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border-default)] p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-[var(--color-text-primary)]">Video File</h2>

          <Controller
            name="videoFile"
            control={control}
            render={({ field }) => (
              <FileInput
                id="videoFile"
                label="Video *"
                type="video"
                accept={FILE_LIMITS.ACCEPTED_VIDEO_TYPES.join(',')}
                maxMB={FILE_LIMITS.VIDEO_MAX_MB}
                hint="MP4, WebM, OGG · Max 500MB"
                error={errors.videoFile?.message}
                onChange={(file) => field.onChange(file)}
              />
            )}
          />

          <Controller
            name="thumbnail"
            control={control}
            render={({ field }) => (
              <FileInput
                id="thumbnail"
                label="Thumbnail *"
                type="image"
                accept={FILE_LIMITS.ACCEPTED_IMAGE_TYPES.join(',')}
                maxMB={FILE_LIMITS.THUMBNAIL_MAX_MB}
                hint="JPEG, PNG, WebP · Recommended: 1280×720"
                error={errors.thumbnail?.message}
                onChange={(file) => field.onChange(file)}
              />
            )}
          />
        </div>

        {/* Metadata */}
        <div className="bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border-default)] p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-[var(--color-text-primary)]">Details</h2>

          <Input
            id="title"
            label="Title *"
            type="text"
            placeholder="Give your video a descriptive title"
            error={errors.title?.message}
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' },
              maxLength: { value: 200, message: 'Title must be under 200 characters' },
            })}
          />

          <Textarea
            id="description"
            label="Description *"
            placeholder="Tell viewers about your video"
            rows={5}
            error={errors.description?.message}
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 10, message: 'Description must be at least 10 characters' },
            })}
          />
        </div>

        {/* Publish Options */}
        <div className="bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border-default)] p-6">
          <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">Visibility</h2>
          <div className="flex flex-col gap-3">
            {[
              { value: true, label: 'Public', desc: 'Anyone can watch this video' },
              { value: false, label: 'Private (Draft)', desc: 'Only you can see this video' },
            ].map((opt) => {
              const isPublished = watch('isPublished')
              return (
                <label
                  key={String(opt.value)}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors',
                    isPublished === opt.value
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                      : 'border-[var(--color-border-default)] hover:border-[var(--color-accent)]/50'
                  )}
                >
                  <input
                    type="radio"
                    value={String(opt.value)}
                    {...register('isPublished', {
                      setValueAs: (v) => v === 'true',
                    })}
                    defaultChecked={opt.value === true}
                    className="mt-0.5 accent-[var(--color-accent)]"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">{opt.label}</span>
                    <span className="text-xs text-[var(--color-text-secondary)] mt-0.5">{opt.desc}</span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pb-4">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg">
            <UploadCloud className="h-4 w-4" />
            Upload Video
          </Button>
        </div>
      </form>
    </div>
  )
}
