import { cn } from '../../utils/cn'

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-2xl',
  '2xl': 'h-20 w-20 text-3xl',
  '3xl': 'h-24 w-24 text-4xl',
}

/**
 * Circular avatar image. Falls back to initials on error or missing src.
 * @param {{ src?: string, alt?: string, size?: 'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl', className?: string }} props
 */
export function Avatar({ src, alt = '', size = 'md', className }) {
  const initials = alt
    ? alt
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? '')
        .join('')
    : '?'

  if (!src) {
    return (
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-semibold shrink-0',
          'bg-[var(--color-accent)] text-white select-none',
          sizes[size],
          className,
        )}
        aria-label={alt || 'Avatar'}
        role="img"
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-full object-cover shrink-0', sizes[size], className)}
      onError={(e) => {
        // On image load failure, hide the img and show fallback
        e.currentTarget.style.display = 'none'
        const fallback = e.currentTarget.nextSibling
        if (fallback) fallback.style.display = 'flex'
      }}
    />
  )
}
