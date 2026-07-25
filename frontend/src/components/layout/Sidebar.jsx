import { NavLink } from 'react-router-dom'
import {
  Home,
  ThumbsUp,
  History,
  Users,
  Tv,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../lib/constants'
import { Avatar } from '../ui/Avatar'

const navItems = [
  { icon: Home, label: 'Home', to: ROUTES.HOME, end: true },
  { icon: ThumbsUp, label: 'Liked Videos', to: ROUTES.LIKED_VIDEOS },
  { icon: History, label: 'History', to: ROUTES.HISTORY },
  { icon: Users, label: 'Subscriptions', to: ROUTES.SUBSCRIPTIONS },
]

const accountItems = [
  { icon: Tv, label: 'Your Channel', toFn: (user) => ROUTES.CHANNEL(user?.username) },
  { icon: LayoutDashboard, label: 'Dashboard', to: ROUTES.DASHBOARD },
  { icon: Settings, label: 'Settings', to: ROUTES.SETTINGS },
]

/**
 * Desktop sidebar — fixed, collapses to icon-only at 64px.
 *
 * Padding model (expanded, sidebar width 240px):
 *   - List container: px-3 (12px each side)
 *   - Nav link item: py-2.5, no horizontal padding (list provides it)
 *   - Icon sits at x=12px from sidebar edge — comfortable breathing room
 *
 * Padding model (collapsed, sidebar width 64px):
 *   - Each icon is centred within the 64px column using mx-auto on a 40×40 button
 *
 * @param {{ collapsed: boolean, onToggle: () => void }} props
 */
export function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth()

  const makeLinkClass = ({ isActive }) =>
    cn(
      'flex items-center rounded-xl text-sm font-medium',
      'transition-colors duration-100 cursor-pointer select-none',
      isActive
        ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-hover)] hover:text-[var(--color-text-primary)]',
      collapsed
        // Collapsed: 40×40 square centred within the 64px sidebar
        ? 'justify-center w-10 h-10'
        // Expanded: full-width row, horizontal padding from the list container
        : 'gap-3 py-2.5 w-full',
    )

  const renderItem = (Icon, label, to, end, key) => (
    <li key={key ?? to} className={collapsed ? 'flex justify-center' : undefined}>
      <NavLink
        to={to}
        end={end}
        aria-label={collapsed ? label : undefined}
        title={collapsed ? label : undefined}
        className={makeLinkClass}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        {!collapsed && <span className="truncate">{label}</span>}
      </NavLink>
    </li>
  )

  return (
    <aside
      className={cn(
        'fixed left-0 bottom-0 z-30 hidden lg:flex flex-col',
        'bg-[var(--color-bg-primary)] border-r border-[var(--color-border-default)]',
        'overflow-hidden',
      )}
      style={{
        top: '56px',
        width: collapsed ? '64px' : '240px',
        transition: 'width 200ms ease-in-out',
      }}
      aria-label="Primary navigation"
    >
      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-none">

        {/* Main nav — container provides horizontal padding when expanded */}
        <ul className={cn('flex flex-col gap-1', collapsed ? 'w-full' : 'px-3')}>
          {navItems.map(({ icon: Icon, label, to, end }) =>
            renderItem(Icon, label, to, end)
          )}
        </ul>

        {/* Divider */}
        <div className="mx-3 my-3 border-t border-[var(--color-border-default)]" aria-hidden="true" />

        {/* Account section */}
        <ul className={cn('flex flex-col gap-1', collapsed ? 'w-full' : 'px-3')}>
          {accountItems.map(({ icon: Icon, label, to, toFn }) => {
            const href = toFn ? toFn(user) : to
            return renderItem(Icon, label, href, undefined, label)
          })}
        </ul>
      </nav>

      {/* User profile card — expanded only */}
      {!collapsed && user && (
        <div className="px-3 py-3 border-t border-[var(--color-border-default)]">
          <div className="flex items-center gap-3 py-2.5 rounded-xl bg-[var(--color-bg-surface)]">
            <Avatar src={user.avatar} alt={user.fullName} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate leading-snug">
                {user.fullName}
              </span>
              <span className="text-xs text-[var(--color-text-secondary)] truncate leading-snug">
                @{user.username}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <div className={cn('pb-3', collapsed ? 'flex justify-center' : 'px-3')}>
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex items-center justify-center rounded-xl text-xs gap-2',
            'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-hover)] hover:text-[var(--color-text-primary)]',
            'transition-colors duration-100 cursor-pointer',
            collapsed ? 'h-10 w-10' : 'h-9 w-full px-3',
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
