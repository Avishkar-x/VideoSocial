import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { AuthLayout } from './components/layout/AuthLayout'
import { MainLayout } from './components/layout/MainLayout'
import { PageSkeleton } from './components/ui/Skeleton'
import queryClient from './lib/queryClient'
import { ROUTES } from './lib/constants'

// ─── Custom Scroll Restoration ───────────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// ─── Lazy-loaded pages ───────────────────────────────────────────────────────
// Auth (eagerly needed, small — still lazy for consistency)
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))

// Protected pages
const HomePage = lazy(() => import('./pages/HomePage'))
const WatchPage = lazy(() => import('./pages/WatchPage'))
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'))

const ChannelPage = lazy(() => import('./pages/ChannelPage'))
const ChannelVideosTab = lazy(() => import('./pages/ChannelVideosTab'))
const ChannelPlaylistsTab = lazy(() => import('./pages/ChannelPlaylistsTab'))
const ChannelTweetsTab = lazy(() => import('./pages/ChannelTweetsTab'))

const PlaylistPage = lazy(() => import('./pages/PlaylistPage'))
const LikedVideosPage = lazy(() => import('./pages/LikedVideosPage'))
const WatchHistoryPage = lazy(() => import('./pages/WatchHistoryPage'))
const SubscriptionsPage = lazy(() => import('./pages/SubscriptionsPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const UploadVideoPage = lazy(() => import('./pages/UploadVideoPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

// 404
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  {/* ── Public-only (redirect to / if authenticated) ──────── */}
                  <Route element={<AuthLayout />}>
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                  </Route>

                  {/* ── Protected (redirect to /login if not authenticated) ── */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path={ROUTES.WATCH_PARAM} element={<WatchPage />} />
                      <Route path={ROUTES.SEARCH} element={<SearchResultsPage />} />

                      {/* Channel with nested tabs */}
                      <Route path={ROUTES.CHANNEL_PARAM} element={<ChannelPage />}>
                        <Route index element={<Navigate to="videos" replace />} />
                        <Route path="videos" element={<ChannelVideosTab />} />
                        <Route path="playlists" element={<ChannelPlaylistsTab />} />
                        <Route path="tweets" element={<ChannelTweetsTab />} />
                      </Route>

                      <Route path={ROUTES.PLAYLIST_PARAM} element={<PlaylistPage />} />
                      <Route path={ROUTES.LIKED_VIDEOS} element={<LikedVideosPage />} />
                      <Route path={ROUTES.HISTORY} element={<WatchHistoryPage />} />
                      <Route path={ROUTES.SUBSCRIPTIONS} element={<SubscriptionsPage />} />
                      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                      <Route path={ROUTES.UPLOAD} element={<UploadVideoPage />} />
                      <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                    </Route>
                  </Route>

                  {/* ── 404 ──────────────────────────────────────────────── */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>

              {/* Toast notifications */}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--color-bg-surface)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '10px',
                    fontSize: '14px',
                  },
                  error: { duration: 5000 },
                  success: {
                    iconTheme: {
                      primary: 'var(--color-success)',
                      secondary: 'white',
                    },
                  },
                }}
              />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
