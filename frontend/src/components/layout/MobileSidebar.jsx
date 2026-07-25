import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  ThumbsUp,
  History,
  Users,
  Tv,
  LayoutDashboard,
  Settings,
  X,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../lib/constants'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'

const allNavItems = [
  { icon: Home, label: 'Home', to: ROUTES.HOME, end: true },
  { icon: ThumbsUp, label: 'Liked Videos', to: ROUTES.LIKED_VIDEOS },
  { icon: History, label: 'History', to: ROUTES.HISTORY },
  { icon: Users, label: 'Subscriptions', to: ROUTES.SUBSCRIPTIONS },
  { icon: LayoutDashboard, label: 'Dashboard', to: ROUTES.DASHBOARD },
  { icon: Settings, label: 'Settings', to: ROUTES.SETTINGS },
]

/**
 * Mobile sidebar drawer (overlay from left).
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export function MobileSidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const drawerRef = useRef(null)

  // Lock body scroll and focus trap
  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'
    drawerRef.current?.focus()

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        tabIndex={-1}
        className="absolute left-0 top-0 bottom-0 w-72 flex flex-col outline-none bg-[var(--color-bg-surface)] border-r border-[var(--color-border-default)] shadow-2xl"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--color-border-default)]">
          <span className="font-bold text-base text-[var(--color-text-primary)]">
            VideoSocial
          </span>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close menu">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2" onClick={onClose}>
          <ul className="flex flex-col gap-0.5">
            {allNavItems.map(({ icon: Icon, label, to, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                      'transition-colors duration-100',
                      isActive
                        ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-hover)] hover:text-[var(--color-text-primary)]',
                    )
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info */}
        {user && (
          <div className="px-3 py-3 border-t border-[var(--color-border-default)]">
            <NavLink
              to={ROUTES.CHANNEL(user.username)}
              onClick={onClose}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[var(--color-bg-surface-hover)] transition-colors"
            >
              <Avatar src={user.avatar} alt={user.fullName} size="sm" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                  {user.fullName}
                </span>
                <span className="text-xs text-[var(--color-text-secondary)] truncate">
                  @{user.username}
                </span>
              </div>
            </NavLink>
          </div>
        )}
      </aside>
    </div>
  )
}
