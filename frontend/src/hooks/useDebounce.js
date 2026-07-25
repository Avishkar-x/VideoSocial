import { useEffect, useState } from 'react'

/**
 * Delays updating a value until the delay period has elapsed since the last change.
 * @param {any} value - The value to debounce.
 * @param {number} delay - Delay in milliseconds (default: 400ms).
 * @returns {any} The debounced value.
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
