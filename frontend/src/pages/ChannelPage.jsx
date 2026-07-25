import { useParams, Outlet, NavLink, Link } from 'react-router-dom'
import { useChannelProfile } from '../hooks/useChannel'
import { useAuth } from '../contexts/AuthContext'
import { Avatar } from '../components/ui/Avatar'
import { SubscribeButton } from '../components/common/SubscribeButton'
import { PageSkeleton } from '../components/ui/Skeleton'
import { ROUTES } from '../lib/constants'
import { formatCount } from '../utils/formatCount'
import { cn } from '../utils/cn'


export default function ChannelPage() {
  const { username } = useParams()
  const { user: currentUser } = useAuth()

  const { data: response, isLoading, isError } = useChannelProfile(username)
  const channel = response?.data?.data

  if (isLoading) return <PageSkeleton />

  if (isError || !channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Channel not found</h2>
        <p className="text-[var(--color-text-secondary)] mt-2">
          This channel does not exist or has been deleted.
        </p>
        <Link to={ROUTES.HOME} className="mt-4 text-[var(--color-accent)] hover:underline font-medium">
          Go back home
        </Link>
      </div>
    )
  }

  const isOwner = currentUser?._id === channel._id
  const TABS = [
    { label: 'Videos', to: 'videos' },
    { label: 'Playlists', to: 'playlists' },
    { label: 'Tweets', to: 'tweets' },
  ]

  return (
    /*
     * Bleed out of the global page padding (p-5 sm:p-8) so the banner
     * spans the full content-area width edge-to-edge.
     */
    <div className="flex flex-col -mx-5 sm:-mx-8 -mt-5 sm:-mt-8">

      {/* ── Banner ──────────────────────────────────────────────────────── */}
      {/*
       * Height: ~160px on mobile, ~200px on sm+, ~220px on lg+.
       * Inline style used for height because Tailwind v4 --spacing causes
       * aspect-ratio/height Tailwind classes to occasionally resolve to 0.
       */}
      <div
        className="w-full bg-[var(--color-bg-surface-hover)] relative overflow-hidden"
        style={{ height: 'clamp(120px, 15vw, 220px)' }}
      >
        {channel.coverImage && (
          <img
            src={channel.coverImage}
            alt={`${channel.fullName}'s channel banner`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* ── Profile Header ──────────────────────────────────────────────── */}
      <div className="px-5 sm:px-8 max-w-[1280px] w-full mx-auto">

        {/*
         * Profile row — sits below the banner.
         * Only the avatar gets a small upward shift (-20px) so it
         * partially overlaps the banner edge (YouTube-style).
         * Channel name, stats, and button remain fully visible below.
         */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-5 pt-2">
          {/* Avatar — small overlap over banner bottom edge */}
          <div className="shrink-0" style={{ marginTop: '-12px' }}>
            <Avatar
              src={channel.avatar}
              alt={channel.fullName}
              size="2xl"
              className="border-4 border-[var(--color-bg-primary)] shadow-lg"
            />
          </div>

          {/* Channel name + stats */}
          <div
            className="flex flex-col flex-1 min-w-0 text-center sm:text-left"
            style={{ paddingBottom: '4px' }}
          >
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] truncate leading-tight">
              {channel.fullName}
            </h1>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-0.5">
              <span className="font-medium">@{channel.username}</span>
              <span aria-hidden="true">•</span>
              <span>{formatCount(channel.subscribersCount)} subscribers</span>
              <span aria-hidden="true">•</span>
              <span>{formatCount(channel.channelsSubscribedToCount)} subscribed</span>
            </div>
          </div>

          {/* Action button */}
          <div className="shrink-0 pb-1">
            {isOwner ? (
              <Link
                to={ROUTES.SETTINGS}
                className="inline-flex items-center justify-center px-5 h-9 rounded-xl text-sm font-medium bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-surface-hover)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] transition-colors whitespace-nowrap"
              >
                Customize Channel
              </Link>
            ) : (
              <SubscribeButton
                channelId={channel._id}
                isSubscribed={channel.isSubscribed}
                username={channel.username}
                size="md"
              />
            )}
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <nav
          className="flex items-center mt-5 border-b border-[var(--color-border-default)] overflow-x-auto scrollbar-none"
          aria-label="Channel sections"
        >
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end
              className={({ isActive }) =>
                cn(
                  'px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-[var(--color-accent)] text-[var(--color-text-primary)]'
                    : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── Tab content ─────────────────────────────────────────────────── */}
      <div className="px-5 sm:px-8 py-6 max-w-[1280px] w-full mx-auto">
        <Outlet context={{ userId: channel._id, isOwner }} />
      </div>
    </div>
  )
}
