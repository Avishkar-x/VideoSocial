import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'
import { MobileSidebar } from './MobileSidebar'
import { BottomBar } from './BottomBar'

// Sidebar pixel widths — must match the w-60 / w-16 values in Sidebar.jsx
// (w-60 = 15rem = 240px, w-16 = 4rem = 64px — at default 16px font)
// We read the actual CSS variable values at runtime to stay in sync.
const SIDEBAR_EXPANDED_PX = 240
const SIDEBAR_COLLAPSED_PX = 64
const TOPBAR_HEIGHT_PX = 56   // h-14 = 3.5rem = 56px at 16px font

/**
 * Main application shell.
 * Composes Topbar + Sidebar + MobileSidebar + BottomBar around the page content.
 *
 * Uses inline style for the sidebar offset on main to avoid a Tailwind v4 CSS
 * variable cascade issue where lg:pl-60 resolves to 0px at runtime.
 */
export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLg, setIsLg] = useState(false)

  // Track lg breakpoint (≥1024px) to apply sidebar offset
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsLg(mq.matches)
    const handler = (e) => setIsLg(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const sidebarOffsetPx = isLg
    ? (sidebarCollapsed ? SIDEBAR_COLLAPSED_PX : SIDEBAR_EXPANDED_PX)
    : 0

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--color-bg-primary)]">
      {/* Fixed Topbar */}
      <Topbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />

      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Page content */}
      <main
        id="main-content"
        className="flex-1 overflow-x-hidden pb-16 lg:pb-0"
        style={{
          paddingTop: `${TOPBAR_HEIGHT_PX}px`,
          paddingLeft: `${sidebarOffsetPx}px`,
          transition: 'padding-left 200ms ease-in-out',
        }}
      >
        <div className="p-5 sm:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <BottomBar />
    </div>
  )
}
