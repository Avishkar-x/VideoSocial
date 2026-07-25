import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Search, Plus, Users, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../lib/constants'

/**
 * Bottom navigation bar — visible on mobile only.
 * Replaces the sidebar as the primary navigation on small screens.
 */
export function BottomBar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const items = [
    { icon: Home, label: 'Home', to: ROUTES.HOME, end: true },
    { icon: Search, label: 'Search', to: ROUTES.SEARCH },
    {
      icon: Plus,
      label: 'Upload',
      to: ROUTES.UPLOAD,
      isAction: true,
    },
    { icon: Users, label: 'Subscriptions', to: ROUTES.SUBSCRIPTIONS },
    {
      icon: User,
      label: 'Profile',
      to: user ? ROUTES.CHANNEL(user.username) : ROUTES.LOGIN,
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden h-16 bg-[var(--color-bg-surface)] border-t border-[var(--color-border-default)]"
      aria-label="Mobile navigation"
    >
      <ul className="h-full flex items-center justify-around">
        {items.map(({ icon: Icon, label, to, end, isAction }) => (
          <li key={label} className="flex-1">
            <NavLink
              to={to}
              end={end}
              aria-label={label}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 h-full py-2',
                  'transition-colors duration-100',
                  isActive
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)]',
                )
              }
            >
              {isAction ? (
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center bg-[var(--color-accent)]"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              ) : (
                <Icon className="h-5 w-5" aria-hidden="true" />
              )}
              {!isAction && (
                <span className="text-[10px] font-medium">{label}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
