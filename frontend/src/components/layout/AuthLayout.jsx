import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { PageSkeleton } from '../ui/Skeleton'
import { ROUTES } from '../../lib/constants'

/**
 * Layout wrapper for public-only routes (login, register).
 * Redirects authenticated users to the home page.
 */
export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <PageSkeleton />
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-[var(--color-bg-primary)]">
      {/* Background gradient */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(109,94,255,0.15), transparent)',
        }}
      />
      <Outlet />
    </div>
  )
}
