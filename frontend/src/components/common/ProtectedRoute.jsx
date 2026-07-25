import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { PageSkeleton } from '../ui/Skeleton'
import { ROUTES } from '../../lib/constants'

/**
 * Wraps protected routes. Redirects to /login if not authenticated.
 * Shows a full-page spinner while auth is initializing.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <PageSkeleton />
  }

  if (!isAuthenticated) {
    // Preserve intended destination so we can redirect back after login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}
