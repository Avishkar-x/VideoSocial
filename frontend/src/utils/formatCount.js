/**
 * Formats a number into a compact display string.
 * 1200 → "1.2K", 3400000 → "3.4M"
 * @param {number} count
 * @returns {string}
 */
export function formatCount(count) {
  if (count == null || isNaN(count)) return '0'

  const n = Number(count)
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return String(n)
}
