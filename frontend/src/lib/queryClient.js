import { QueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

function onQueryError(error) {
  // Network errors and 5xx errors
  const message = error?.response?.data?.message || error?.message || 'Something went wrong.'
  // Avoid showing toast for 401 (handled by auth interceptor)
  if (error?.response?.status !== 401) {
    toast.error(message, { id: 'query-error' })
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes — prevents refetch on back-navigation
      staleTime: 1000 * 60 * 5,
      // Keep unused cache for 10 minutes
      gcTime: 1000 * 60 * 10,
      // Retry once on failure, but not on 4xx errors
      retry: (failureCount, error) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 1
      },
      refetchOnWindowFocus: false,
      onError: onQueryError,
    },
    mutations: {
      onError: (error) => {
        const message =
          error?.response?.data?.message || error?.message || 'Something went wrong.'
        if (error?.response?.status !== 401) {
          toast.error(message)
        }
      },
    },
  },
})

export default queryClient
