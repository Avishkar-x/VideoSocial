import { Link } from 'react-router-dom'
import { useSubscribedChannels } from '../hooks/useSubscription'
import { useAuth } from '../contexts/AuthContext'
import { Avatar } from '../components/ui/Avatar'
import { SubscribeButton } from '../components/common/SubscribeButton'
import { PageSkeleton } from '../components/ui/Skeleton'
import { Users } from 'lucide-react'
import { ROUTES } from '../lib/constants'

export default function SubscriptionsPage() {
  const { user } = useAuth()
  const { data: response, isLoading, isError } = useSubscribedChannels(user?._id)

  const channels = response?.data?.data?.map(sub => sub.channel) || []

  if (isLoading) return <PageSkeleton />

  if (isError) {
    return (
      <div className="p-4 rounded-xl bg-[var(--color-destructive)]/10 text-[var(--color-destructive)] text-sm">
        Failed to load subscriptions.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border-default)]">
        <div className="h-10 w-10 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center shrink-0">
          <Users className="h-5 w-5 text-[var(--color-text-secondary)]" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            Subscriptions
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Channels you are subscribed to
          </p>
        </div>
      </div>

      {channels.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-secondary)] text-sm">
          You haven't subscribed to any channels yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <div
              key={channel._id}
              className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] hover:border-[var(--color-accent)] transition-colors group"
            >
              <Link to={ROUTES.CHANNEL(channel.username)} className="shrink-0" tabIndex={-1}>
                <Avatar src={channel.avatar} alt={channel.fullName} size="lg" />
              </Link>
              <div className="flex flex-col min-w-0 flex-1">
                <Link
                  to={ROUTES.CHANNEL(channel.username)}
                  className="font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent)] transition-colors"
                >
                  {channel.fullName}
                </Link>
                <span className="text-xs text-[var(--color-text-secondary)] truncate">
                  @{channel.username}
                </span>
                
                <div className="mt-2">
                  <SubscribeButton
                    channelId={channel._id}
                    isSubscribed={true} // They are in the subscribed list
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
