import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Upload, Sun, Moon, Menu, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import {
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  DropdownHeader,
} from '../ui/DropdownMenu'
import { useDebounce } from '../../hooks/useDebounce'
import { ROUTES } from '../../lib/constants'
import toast from 'react-hot-toast'

/**
 * Fixed top navigation bar.
 * Layout: [Left: hamburger + logo] [Center: search] [Right: actions]
 * @param {{ onMobileMenuToggle: () => void }} props
 */
export function Topbar({ onMobileMenuToggle }) {
  const { user, isAuthenticated, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const debouncedQuery = useDebounce(searchQuery, 400)

  const handleSearchChange = useCallback(
    (e) => {
      const val = e.target.value
      setSearchQuery(val)
      if (debouncedQuery !== val) return
    },
    [debouncedQuery],
  )

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const q = searchQuery.trim()
      if (q) {
        navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(q)}`)
        setMobileSearchOpen(false)
      }
    },
    [searchQuery, navigate],
  )

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      navigate(ROUTES.LOGIN)
      toast.success('Logged out successfully.')
    } catch {
      toast.error('Failed to log out. Please try again.')
    }
  }, [logout, navigate])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-default)]"
      style={{ height: '56px' }}
    >
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-accent)] focus:text-white focus:text-sm"
      >
        Skip to content
      </a>

      {/* ── Mobile: search expanded takes full bar ── */}
      {mobileSearchOpen && (
        <div className="flex items-center h-full px-4 gap-2 md:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 items-center"
            role="search"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)] pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
                aria-label="Search videos"
                autoFocus
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
          </form>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setMobileSearchOpen(false)}
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* ── Normal layout: three zones ── */}
      {!mobileSearchOpen && (
        <div className="flex items-center h-full px-6 sm:px-8">

          {/* LEFT: hamburger (mobile) + logo */}
          <div className="flex items-center gap-2 shrink-0" style={{ minWidth: '148px' }}>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMobileMenuToggle}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2.5 font-bold text-[15px] text-[var(--color-text-primary)] shrink-0"
              aria-label="VideoSocial — Home"
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0"
                style={{ background: 'var(--color-accent)' }}
                aria-hidden="true"
              >
                VS
              </div>
              <span className="hidden sm:inline tracking-tight">VideoSocial</span>
            </Link>
          </div>

          {/* CENTER: search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 justify-center px-6"
            role="search"
          >
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)] pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search videos..."
                aria-label="Search videos"
                className="w-full h-10 pl-11 pr-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
          </form>

          {/* RIGHT: action icons */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto" style={{ minWidth: '148px', justifyContent: 'flex-end' }}>
            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated && (
              <>
                {/* Upload */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex"
                  onClick={() => navigate(ROUTES.UPLOAD)}
                  aria-label="Upload video"
                >
                  <Upload className="h-5 w-5" />
                </Button>

                {/* User avatar dropdown */}
                <DropdownMenu
                  trigger={
                    <Button variant="ghost" size="icon" aria-label="Open user menu">
                      <Avatar
                        src={user?.avatar}
                        alt={user?.fullName ?? user?.username}
                        size="sm"
                      />
                    </Button>
                  }
                  align="right"
                >
                  <DropdownHeader>
                    <div className="flex flex-col">
                      <span className="text-[var(--color-text-primary)] font-semibold text-sm">
                        {user?.fullName}
                      </span>
                      <span className="text-[var(--color-text-secondary)] text-xs font-normal">
                        @{user?.username}
                      </span>
                    </div>
                  </DropdownHeader>
                  <DropdownSeparator />
                  <DropdownItem onClick={() => navigate(ROUTES.CHANNEL(user?.username))}>
                    Your Channel
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate(ROUTES.DASHBOARD)}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate(ROUTES.SETTINGS)}>
                    Settings
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem danger onClick={handleLogout}>
                    Sign out
                  </DropdownItem>
                </DropdownMenu>
              </>
            )}

            {!isAuthenticated && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Sign in
              </Button>
            )}
          </div>

        </div>
      )}
    </header>
  )
}
