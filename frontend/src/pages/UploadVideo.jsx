import React, { useState } from 'react'
import { publishVideo } from "../api/video.api"
import { Upload, Film, ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

function UploadVideo() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)

    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError("")
        setSuccess("")

        // Validation
        if (!title.trim()) {
            setError("Title is required")
            return
        }

        if (!description.trim()) {
            setError("Description is required")
            return
        }

        if (!videoFile) {
            setError("Video is required")
            return
        }

        if (!thumbnail) {
            setError("Thumbnail is required")
            return
        }

        const formData = new FormData()

        formData.append("title", title)
        formData.append("description", description)
        formData.append("videoFile", videoFile)
        formData.append("thumbnail", thumbnail)

        try {
            setIsUploading(true)

            const response = await publishVideo(formData)

            console.log(response)
            setSuccess("Video uploaded successfully")

            // Clear form
            setTitle("")
            setDescription("")
            setVideoFile(null)
            setThumbnail(null)

            // Reset file inputs visually
            e.target.reset()

        } catch (error) {
            console.log(error)

            setError(
                error?.response?.data?.message ||
                "Failed to upload video"
            )
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-2xl">

                {/* Page heading */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-text-primary">Upload Video</h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Share your video with the VideoSocial community
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-white/10 bg-bg-surface/50 p-6 sm:p-8 shadow-xl backdrop-blur-md">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Title */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-secondary" htmlFor="title">
                                Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Give your video a title"
                                disabled={isUploading}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent focus:bg-bg-elevated focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-secondary" htmlFor="description">
                                Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tell viewers about your video"
                                disabled={isUploading}
                                rows={4}
                                className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent focus:bg-bg-elevated focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {/* File inputs row */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {/* Video file */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-secondary" htmlFor="videoFile">
                                    Video File <span className="text-red-400">*</span>
                                </label>
                                <label
                                    htmlFor="videoFile"
                                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all
                                        ${videoFile
                                            ? 'border-accent/60 bg-accent/5'
                                            : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                        }
                                        ${isUploading ? 'cursor-not-allowed opacity-50' : ''}
                                    `}
                                >
                                    <Film className={`h-7 w-7 ${videoFile ? 'text-accent' : 'text-text-muted'}`} />
                                    <span className="text-xs text-text-secondary">
                                        {videoFile ? videoFile.name : 'Click to select video'}
                                    </span>
                                    <input
                                        id="videoFile"
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => setVideoFile(e.target.files[0])}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Thumbnail */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-secondary" htmlFor="thumbnail">
                                    Thumbnail <span className="text-red-400">*</span>
                                </label>
                                <label
                                    htmlFor="thumbnail"
                                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all
                                        ${thumbnail
                                            ? 'border-accent/60 bg-accent/5'
                                            : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                        }
                                        ${isUploading ? 'cursor-not-allowed opacity-50' : ''}
                                    `}
                                >
                                    <ImageIcon className={`h-7 w-7 ${thumbnail ? 'text-accent' : 'text-text-muted'}`} />
                                    <span className="text-xs text-text-secondary">
                                        {thumbnail ? thumbnail.name : 'Click to select image'}
                                    </span>
                                    <input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setThumbnail(e.target.files[0])}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="flex items-center gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Success message */}
                        {success && (
                            <div className="flex items-center gap-2.5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                                <p className="text-sm text-green-400">{success}</p>
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    Upload Video
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default UploadVideo