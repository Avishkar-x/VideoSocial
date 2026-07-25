import { formatDistanceToNow, format } from 'date-fns'

/**
 * Returns a relative time string — e.g. "3 days ago".
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelativeDate(date) {
  if (!date) return ''
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return ''
  }
}

/**
 * Returns an absolute date string — e.g. "Jul 5, 2025".
 * Used in tooltips alongside formatRelativeDate.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatAbsoluteDate(date) {
  if (!date) return ''
  try {
    return format(new Date(date), 'MMM d, yyyy')
  } catch {
    return ''
  }
}
