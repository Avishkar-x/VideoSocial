import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

/**
 * Text input with optional label and error message.
 */
export const Input = forwardRef(function Input(
  { label, error, id, className, wrapperClassName, ...props },
  ref,
) {
  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'h-9 w-full rounded-lg border px-3 text-sm',
          'bg-[var(--color-bg-surface)] border-[var(--color-border-default)]',
          'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]',
          'transition-colors duration-150',
          'focus:outline-none focus:border-[var(--color-accent)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-[var(--color-destructive)] focus:border-[var(--color-destructive)]',
          className,
        )}
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

/**
 * Textarea with optional label and error message.
 */
export const Textarea = forwardRef(function Textarea(
  { label, error, id, className, wrapperClassName, rows = 4, ...props },
  ref,
) {
  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-sm resize-none',
          'bg-[var(--color-bg-surface)] border-[var(--color-border-default)]',
          'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]',
          'transition-colors duration-150',
          'focus:outline-none focus:border-[var(--color-accent)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-[var(--color-destructive)] focus:border-[var(--color-destructive)]',
          className,
        )}
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
