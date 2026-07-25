import { useForm, Controller } from 'react-hook-form'
import { User, KeyRound, ImageIcon, PanelTop } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useUpdateAccount, useChangePassword, useUpdateAvatar, useUpdateCoverImage } from '../hooks/useUser'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { FileInput } from '../components/ui/FileInput'
import { FILE_LIMITS } from '../lib/constants'
import toast from 'react-hot-toast'

// ─── Section wrapper ─────────────────────────────────────────────────────────

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <div className="flex flex-col gap-5 bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border-default)] p-6">
      <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-default)]">
        <div className="h-10 w-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-[var(--color-accent)]" />
        </div>
        <div>
          <h2 className="font-bold text-base text-[var(--color-text-primary)]">{title}</h2>
          {description && <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

// ─── Account Details Form ─────────────────────────────────────────────────────

function AccountDetailsForm({ user }) {
  const { mutate, isPending } = useUpdateAccount()

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))} className="flex flex-col gap-4">
      <Input
        id="settings-fullName"
        label="Full name"
        type="text"
        error={errors.fullName?.message}
        {...register('fullName', {
          required: 'Full name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
        })}
      />
      <Input
        id="settings-email"
        label="Email address"
        type="email"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email',
          },
        })}
      />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="sm" isLoading={isPending} disabled={!isDirty}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}

// ─── Change Password Form ─────────────────────────────────────────────────────

function ChangePasswordForm() {
  const { mutate, isPending } = useChangePassword()

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = (data) => {
    mutate(
      { oldPassword: data.oldPassword, newPassword: data.newPassword },
      { onSuccess: () => reset() }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="oldPassword"
        label="Current password"
        type="password"
        autoComplete="current-password"
        error={errors.oldPassword?.message}
        {...register('oldPassword', { required: 'Current password is required' })}
      />
      <Input
        id="newPassword"
        label="New password"
        type="password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register('newPassword', {
          required: 'New password is required',
          minLength: { value: 8, message: 'Password must be at least 8 characters' },
        })}
      />
      <Input
        id="confirmPassword"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (v) => v === watch('newPassword') || 'Passwords do not match',
        })}
      />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="sm" isLoading={isPending}>
          Change Password
        </Button>
      </div>
    </form>
  )
}

// ─── Avatar Upload Form ───────────────────────────────────────────────────────

function AvatarUploadForm({ user }) {
  const { mutate, isPending } = useUpdateAvatar()

  const handleFileChange = (file) => {
    if (!file) return
    const fd = new FormData()
    fd.append('avatar', file)
    mutate(fd)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <Avatar src={user?.avatar} alt={user?.fullName} size="3xl" />
      <div className="flex flex-col gap-2 flex-1 min-w-0 w-full">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Upload a new profile photo. JPEG, PNG or WebP, max 5MB.
        </p>
        <FileInput
          id="avatarUpload"
          type="image"
          accept={FILE_LIMITS.ACCEPTED_IMAGE_TYPES.join(',')}
          maxMB={FILE_LIMITS.AVATAR_MAX_MB}
          onChange={handleFileChange}
        />
        {isPending && (
          <p className="text-xs text-[var(--color-accent)]">Uploading…</p>
        )}
      </div>
    </div>
  )
}

// ─── Cover Image Upload Form ──────────────────────────────────────────────────

function CoverImageUploadForm({ user }) {
  const { mutate, isPending } = useUpdateCoverImage()

  const handleFileChange = (file) => {
    if (!file) return
    const fd = new FormData()
    fd.append('coverImage', file)
    mutate(fd)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Preview current cover */}
      {user?.coverImage && (
        <div className="aspect-[5/1] rounded-xl overflow-hidden bg-[var(--color-bg-surface-hover)]">
          <img src={user.coverImage} alt="Current cover" className="w-full h-full object-cover" />
        </div>
      )}
      <p className="text-sm text-[var(--color-text-secondary)]">
        Upload a new cover image. Recommended size 1280×320px. Max 10MB.
      </p>
      <FileInput
        id="coverUpload"
        type="image"
        accept={FILE_LIMITS.ACCEPTED_IMAGE_TYPES.join(',')}
        maxMB={FILE_LIMITS.COVER_MAX_MB}
        hint="Recommended: 1280×320px"
        onChange={handleFileChange}
      />
      {isPending && (
        <p className="text-xs text-[var(--color-accent)]">Uploading…</p>
      )}
    </div>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="pb-4 border-b border-[var(--color-border-default)]">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage your account details and preferences.
        </p>
      </div>

      <SettingsSection
        icon={User}
        title="Account Details"
        description="Update your name and email address."
      >
        <AccountDetailsForm user={user} />
      </SettingsSection>

      <SettingsSection
        icon={KeyRound}
        title="Change Password"
        description="Choose a strong password you don't use elsewhere."
      >
        <ChangePasswordForm />
      </SettingsSection>

      <SettingsSection
        icon={ImageIcon}
        title="Profile Photo"
        description="This photo appears on your channel and comments."
      >
        <AvatarUploadForm user={user} />
      </SettingsSection>

      <SettingsSection
        icon={PanelTop}
        title="Cover Image"
        description="This banner appears at the top of your channel page."
      >
        <CoverImageUploadForm user={user} />
      </SettingsSection>
    </div>
  )
}
