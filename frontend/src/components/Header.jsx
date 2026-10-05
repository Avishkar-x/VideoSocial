import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, PlaySquare, Bell, User, X, Home, Upload, History, ThumbsUp, ListVideo, LayoutDashboard, Settings, LogOut, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function Header() {
  const [search, setSearch] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on any click outside the dropdown container
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!search.trim()) return
    navigate(`/search?query=${encodeURIComponent(search.trim())}`)
    setSidebarOpen(false)
  }

  const handleLogout = async () => {
    setSidebarOpen(false)
    await logout()
    navigate('/login')
  }

  const navLinks = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/upload', icon: Upload, label: 'Upload Video' },
    { to: '/history', icon: History, label: 'Watch History' },
    { to: '/liked', icon: ThumbsUp, label: 'Liked Videos' },
    { to: '/playlists', icon: ListVideo, label: 'Playlists' },
    { to: '/subscriptions', icon: Users, label: 'Subscriptions' },
    { to: '/subscribers', icon: Users, label: 'Subscribers' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/account', icon: Settings, label: 'Account Settings' },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-bg-base/70 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-full p-2 text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2 group">
              <PlaySquare className="h-6 w-6 text-accent transition-transform group-hover:scale-110 group-active:scale-95" />
              <span className="text-lg font-bold tracking-tight text-text-primary">VideoSocial</span>
            </Link>
          </div>

          {/* Middle: Search bar (Glassmorphic) */}
          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full max-w-xl items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 focus-within:border-accent/50 focus-within:bg-bg-surface focus-within:ring-1 focus-within:ring-accent/50 transition-all"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search videos..."
                className="w-full bg-transparent text-sm text-text-primary placeholder-text-muted focus:outline-none"
              />
              <button
                type="submit"
                className="ml-2 text-text-muted hover:text-text-primary transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="md:hidden rounded-full p-2 text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button className="rounded-full p-2 text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent"></span>
            </button>
            <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar button */}
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="flex items-center justify-center rounded-full border border-white/10 bg-bg-surface p-0.5 hover:border-accent/50 transition-colors overflow-hidden h-9 w-9"
                  title={`@${user?.username}`}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <User className="h-5 w-5 text-text-secondary" />
                  )}
                </button>



                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-white/10 bg-bg-surface shadow-xl overflow-hidden">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-semibold text-text-primary truncate">{user?.fullName}</p>
                      <p className="text-xs text-text-muted truncate">@{user?.username}</p>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        to={`/c/${user?.username}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                      >
                        <User className="h-4 w-4 shrink-0" />
                        View Profile
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                      >
                        <Settings className="h-4 w-4 shrink-0" />
                        Account Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/5 py-1">
                      <button
                        onClick={() => { setDropdownOpen(false); handleLogout() }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full border border-white/10 bg-bg-surface p-1.5 hover:bg-bg-elevated transition-colors"
              >
                <User className="h-5 w-5 text-text-secondary" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar drawer */}
      <div className={`fixed top-0 left-0 z-[60] h-full w-72 bg-bg-base border-r border-white/5 flex flex-col transition-transform duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/5 shrink-0">
          <Link to={isAuthenticated ? "/home" : "/"} onClick={() => setSidebarOpen(false)} className="flex items-center gap-2">
            <PlaySquare className="h-6 w-6 text-accent" />
            <span className="text-lg font-bold tracking-tight text-text-primary">VideoSocial</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-full p-1.5 text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile search */}
        <div className="px-4 py-3 border-b border-white/5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center rounded-full border border-white/10 bg-bg-surface px-3 py-1.5 focus-within:border-accent/50 transition-all">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted focus:outline-none"
            />
            <button type="submit" className="ml-2 text-text-muted hover:text-text-primary transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* User info */}
        {isAuthenticated && (
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                  {user?.fullName?.[0] || "?"}
                </div>
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-text-primary truncate">{user?.fullName}</span>
              <span className="text-xs text-text-muted truncate">@{user?.username}</span>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-3">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors rounded-lg mx-2"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>


      </div>
    </>
  )
}

export default Header