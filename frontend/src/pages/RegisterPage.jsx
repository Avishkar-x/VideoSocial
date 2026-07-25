import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { register as apiRegister } from '../api/auth.api'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { FileInput } from '../components/ui/FileInput'
import { ROUTES, FILE_LIMITS } from '../lib/constants'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      avatar: null,
      coverImage: null,
    },
  })

  const onSubmit = useCallback(
    async (data) => {
      if (!data.avatar) {
        toast.error('Profile photo is required.')
        return
      }

      setIsSubmitting(true)
      const toastId = toast.loading('Creating your account...')

      try {
        const formData = new FormData()
        formData.append('fullName', data.fullName.trim())
        formData.append('email', data.email.trim().toLowerCase())
        formData.append('username', data.username.trim().toLowerCase())
        formData.append('password', data.password)
        formData.append('avatar', data.avatar)
        if (data.coverImage) {
          formData.append('coverImage', data.coverImage)
        }

        await apiRegister(formData)
        
        // Auto-login after successful registration
        await login({ email: data.email.trim().toLowerCase(), password: data.password })
        
        toast.success('Account created successfully!', { id: toastId })
        navigate(ROUTES.HOME)
      } catch (error) {
        const message =
          error?.response?.data?.message ?? 'Registration failed. Please try again.'
        toast.error(message, { id: toastId })
      } finally {
        setIsSubmitting(false)
      }
    },
    [login, navigate],
  )

  return (
    <div className="w-full max-w-lg">
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
              Create account
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Start sharing your videos
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
          <Input
            id="fullName"
            label="Full name"
            type="text"
            placeholder="Alex Johnson"
            autoComplete="name"
            autoFocus
            error={errors.fullName?.message}
            {...register('fullName', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
              maxLength: { value: 60, message: 'Name must be under 60 characters' },
            })}
          />

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />

          <Input
            id="username"
            label="Username"
            type="text"
            placeholder="alexjohnson"
            autoComplete="username"
            error={errors.username?.message}
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Username must be at least 3 characters' },
              maxLength: { value: 30, message: 'Username must be under 30 characters' },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores',
              },
            })}
          />

          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.password?.message}
              className="pr-10"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
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

          {/* Avatar upload — required */}
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <FileInput
                id="avatar"
                label="Profile photo (required)"
                type="image"
                accept={FILE_LIMITS.ACCEPTED_IMAGE_TYPES.join(',')}
                maxMB={FILE_LIMITS.AVATAR_MAX_MB}
                hint="JPEG, PNG, or WebP"
                error={errors.avatar?.message}
                onChange={(file) => field.onChange(file)}
              />
            )}
          />

          {/* Cover image — optional */}
          <Controller
            name="coverImage"
            control={control}
            render={({ field }) => (
              <FileInput
                id="coverImage"
                label="Cover image (optional)"
                type="image"
                accept={FILE_LIMITS.ACCEPTED_IMAGE_TYPES.join(',')}
                maxMB={FILE_LIMITS.COVER_MAX_MB}
                hint="Recommended: 1280×320px"
                onChange={(file) => field.onChange(file)}
              />
            )}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full mt-2"
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-[var(--color-accent)] font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
