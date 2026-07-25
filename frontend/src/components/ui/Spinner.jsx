import { cn } from '../../utils/cn'

/**
 * @param {{ className?: string, size?: 'sm'|'md'|'lg' }} props
 */
export function Spinner({ className, size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[3px]',
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-full border-[var(--color-border-default)] border-t-[var(--color-accent)] animate-spin',
        sizes[size],
        className,
      )}
    />
  )
}
