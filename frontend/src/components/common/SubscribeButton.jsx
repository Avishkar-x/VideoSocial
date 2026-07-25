import { useState, useEffect } from 'react'
import { useToggleSubscription } from '../../hooks/useSubscription'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Bell, BellRing } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../lib/constants'

/**
 * Reusable Subscribe button.
 * Handles the toggle mutation internally.
 * @param {{ channelId: string, isSubscribed: boolean, username?: string, size?: string, className?: string }} props
 */
export function SubscribeButton({ channelId, isSubscribed, username, size = 'md', className }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [localIsSubscribed, setLocalIsSubscribed] = useState(isSubscribed)

  useEffect(() => {
    setLocalIsSubscribed(isSubscribed)
  }, [isSubscribed])

  const { mutate, isPending } = useToggleSubscription(username)

  const handleToggle = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN)
      return
    }
    
    const previous = localIsSubscribed
    setLocalIsSubscribed(!localIsSubscribed)

    mutate(channelId, {
      onError: () => setLocalIsSubscribed(previous)
    })
  }

  return (
    <Button
      variant={localIsSubscribed ? 'secondary' : 'primary'}
      size={size}
      onClick={handleToggle}
      disabled={isPending}
      className={className}
      aria-label={localIsSubscribed ? 'Unsubscribe' : 'Subscribe'}
    >
      {localIsSubscribed ? (
        <>
          <BellRing className="h-4 w-4" />
          Subscribed
        </>
      ) : (
        <>
          <Bell className="h-4 w-4" />
          Subscribe
        </>
      )}
    </Button>
  )
}
