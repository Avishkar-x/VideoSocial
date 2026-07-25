import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

/**
 * Top-level error boundary that catches unexpected render crashes.
 * Shows a recovery UI instead of a blank screen.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production, you'd send this to an error tracking service
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center gap-6 p-8 text-center bg-[var(--color-bg-primary)]">
          <AlertTriangle
            className="h-14 w-14 text-[var(--color-destructive)] opacity-70"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Something went wrong
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
              An unexpected error occurred. Please reload the page.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
