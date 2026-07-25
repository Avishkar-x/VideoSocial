import { Link } from 'react-router-dom'
import { Home, SearchX } from 'lucide-react'
import { ROUTES } from '../lib/constants'

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6 p-8 text-center bg-[var(--color-bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <SearchX
          className="h-16 w-16 text-[var(--color-text-secondary)] opacity-50"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-6xl font-black text-[var(--color-accent)]">404</h1>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Page not found
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-xs">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
      </div>

      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white transition-colors"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>
    </div>
  )
}
