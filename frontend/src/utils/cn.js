import { clsx } from 'clsx'

/**
 * Merges class names conditionally.
 * Usage: cn('base', condition && 'conditional', className)
 */
export function cn(...inputs) {
  return clsx(...inputs)
}
