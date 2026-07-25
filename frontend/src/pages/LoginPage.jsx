import { useCallback, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { ROUTES } from '../lib/constants'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect back to the page the user was trying to access
  const from = location.state?.from?.pathname ?? ROUTES.HOME

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { identifier: '', password: '' },
  })

  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true)
      try {
        // Backend accepts either email or username in the same field
        const isEmail = data.identifier.includes('@')
        const credentials = isEmail
          ? { email: data.identifier, password: data.password }
          : { username: data.identifier, password: data.password }

        await login(credentials)
        navigate(from, { replace: true })
        toast.success('Welcome back!')
      } catch (error) {
        const message =
          error?.response?.data?.message ?? 'Invalid credentials. Please try again.'
        toast.error(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [login, navigate, from],
  )

  return (
    <div className="w-full max-w-lg">
      {/* Card */}
      <div className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-10 sm:p-12 shadow-2xl">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg"
            style={{ background: 'var(--color-accent)' }}
            aria-hidden="true"
          >
            VS
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Welcome back
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Sign in to your account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
          <Input
            id="identifier"
            label="Email or username"
            type="text"
            placeholder="you@example.com"
            autoComplete="username"
            autoFocus
            error={errors.identifier?.message}
            {...register('identifier', {
              required: 'Email or username is required',
              minLength: { value: 3, message: 'Must be at least 3 characters' },
            })}
          />

          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              className="pr-10"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 bottom-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full mt-2"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
          Don&apos;t have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-[var(--color-accent)] font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
