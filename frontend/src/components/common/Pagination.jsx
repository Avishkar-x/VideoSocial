import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

/**
 * Reusable pagination component.
 * @param {{ page: number, totalPages: number, onPageChange: (page: number) => void }} props
 */
export function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = []
    const showMax = 5 // Max number of buttons to show at once
    
    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      // Complex logic for ellipsis
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((p, i) => {
        if (p === '...') {
          return (
            <div
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-[var(--color-text-secondary)]"
            >
              <MoreHorizontal className="h-4 w-4" />
            </div>
          )
        }

        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-8 h-8 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
              page === p
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-hover)] hover:text-[var(--color-text-primary)]'
            )}
            aria-current={page === p ? 'page' : undefined}
          >
            {p}
          </button>
        )
      })}

      <Button
        variant="ghost"
        size="icon-sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
