import { forwardRef, useRef, useState } from 'react'
import { Upload, X, Image, Video } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * File input with drag-and-drop, preview, and validation.
 *
 * @param {{
 *   accept?: string,
 *   label?: string,
 *   error?: string,
 *   hint?: string,
 *   type?: 'image'|'video'|'any',
 *   onChange?: (file: File|null) => void,
 *   maxMB?: number,
 *   className?: string,
 * }} props
 */
export const FileInput = forwardRef(function FileInput(
  { accept, label, error, hint, type = 'any', onChange, maxMB, className, id, ...props },
  ref,
) {
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState(null)
  const inputRef = useRef(null)

  // Merge external ref with internal ref
  function setRef(el) {
    inputRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) ref.current = el
  }

  function handleFile(file) {
    if (!file) {
      setPreview(null)
      setFileName(null)
      onChange?.(null)
      return
    }

    setFileName(file.name)

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview({ type: 'image', src: reader.result })
      reader.readAsDataURL(file)
    } else if (file.type.startsWith('video/')) {
      setPreview({ type: 'video', src: URL.createObjectURL(file) })
    } else {
      setPreview(null)
    }

    onChange?.(file)
  }

  function handleChange(e) {
    handleFile(e.target.files?.[0] ?? null)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0] ?? null)
  }

  function clearFile(e) {
    e.stopPropagation()
    if (inputRef.current) inputRef.current.value = ''
    setPreview(null)
    setFileName(null)
    onChange?.(null)
  }

  const IconComponent = type === 'image' ? Image : type === 'video' ? Video : Upload

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3',
          'min-h-[120px] rounded-lg border-2 border-dashed cursor-pointer',
          'transition-colors duration-150',
          dragOver
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
            : 'border-[var(--color-border-default)] hover:border-[var(--color-accent)]/50 bg-[var(--color-bg-surface)]',
          error && 'border-[var(--color-destructive)]',
        )}
      >
        {/* Preview */}
        {preview ? (
          <>
            {preview.type === 'image' ? (
              <img
                src={preview.src}
                alt="Preview"
                className="w-full h-full object-cover rounded-md max-h-48"
              />
            ) : (
              <video
                src={preview.src}
                className="w-full max-h-48 rounded-md"
                muted
                playsInline
              />
            )}
            <button
              type="button"
              onClick={clearFile}
              className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <IconComponent className="h-8 w-8 text-[var(--color-text-secondary)]" aria-hidden="true" />
              <div className="text-center">
                <p className="text-sm text-[var(--color-text-primary)]">
                  {fileName ?? (
                    <>
                      <span className="text-[var(--color-accent)] font-medium">Click to upload</span>
                      {' '}or drag and drop
                    </>
                  )}
                </p>
                {hint && <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{hint}</p>}
                {maxMB && (
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Max {maxMB}MB
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <input
        ref={setRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
        {...props}
      />

      {error && (
        <p className="text-xs text-[var(--color-destructive)]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})
