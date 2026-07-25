import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white',
  secondary:
    'bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-surface-hover)] text-[var(--color-text-primary)] border border-[var(--color-border-default)]',
  ghost: 'bg-transparent hover:bg-[var(--color-bg-surface-hover)] text-[var(--color-text-primary)]',
  danger:
    'bg-[var(--color-destructive)] hover:opacity-90 text-white',
  'danger-ghost':
    'bg-transparent hover:bg-[var(--color-destructive)]/10 text-[var(--color-destructive)]',
}

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2',
  icon: 'h-9 w-9 p-0',
  'icon-sm': 'h-8 w-8 p-0',
  'icon-lg': 'h-11 w-11 p-0',
}

/**
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'|'danger-ghost'} [props.variant]
 * @param {'sm'|'md'|'lg'|'icon'|'icon-sm'|'icon-lg'} [props.size]
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className,
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg',
        'transition-colors duration-150 cursor-pointer select-none',
        'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-hidden="true"
          />
          {children && <span className="sr-only">{children}</span>}
        </>
      ) : (
        children
      )}
    </button>
  )
}
