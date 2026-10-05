import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlaySquare, Mail, Lock, User, Image, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { register } from '../api/auth.api';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Form state — matches backend field names exactly
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Validate required fields before submitting
  const validate = () => {
    if (!fullName.trim()) return 'Full name is required.'
    if (!username.trim()) return 'Username is required.'
    if (!email.trim()) return 'Email is required.'
    if (!password.trim()) return 'Password is required.'
    if (!avatar) return 'Avatar image is required.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    // Build multipart/form-data — backend reads req.files.avatar[0] and req.files.coverImage[0]
    const formData = new FormData()
    formData.append('fullName', fullName.trim())
    formData.append('username', username.trim().toLowerCase())
    formData.append('email', email.trim())
    formData.append('password', password)
    formData.append('avatar', avatar)
    if (coverImage) formData.append('coverImage', coverImage)

    try {
      await register(formData)
      setSuccess('Account created! Signing you in…')
      // Auto-login using existing AuthContext.login() — no locked modules changed
      try {
        await login({ email: email.trim(), password })
        navigate('/')
      } catch {
        // Auto-login failed — fall back to login page
        setTimeout(() => navigate('/login'), 1000)
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-bg-surface/50 p-8 shadow-xl backdrop-blur-md">
        
        <div className="mb-8 flex flex-col items-center justify-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <PlaySquare className="h-6 w-6 text-accent" />
          </div>
          <h1 className="mt-2 text-2xl font-bold text-text-primary">Create an Account</h1>
          <p className="text-sm text-text-secondary">Join VideoSocial today</p>
        </div>

        {/* Error / Success banners */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2.5 text-sm text-success">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent focus:bg-bg-elevated focus:ring-1 focus:ring-accent disabled:opacity-60"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
                  <span className="text-lg leading-none mt-0.5">@</span>
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent focus:bg-bg-elevated focus:ring-1 focus:ring-accent disabled:opacity-60"
                  placeholder="johndoe"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent focus:bg-bg-elevated focus:ring-1 focus:ring-accent disabled:opacity-60"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent focus:bg-bg-elevated focus:ring-1 focus:ring-accent disabled:opacity-60"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* File uploads */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
            {/* Avatar */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Avatar <span className="text-destructive">*</span>
              </label>
              <label className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed py-3 transition-all
                ${avatar
                  ? 'border-accent/60 bg-accent/5 hover:bg-accent/10'
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                } ${isLoading ? 'pointer-events-none opacity-60' : ''}`}>
                <Image className={`h-4 w-4 ${avatar ? 'text-accent' : 'text-text-secondary'}`} />
                <span className={`text-xs text-center px-2 truncate max-w-full ${avatar ? 'text-accent' : 'text-text-secondary'}`}>
                  {avatar ? avatar.name : 'Upload Avatar'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  disabled={isLoading}
                  onChange={e => setAvatar(e.target.files[0] || null)}
                />
              </label>
            </div>
            
            {/* Cover Image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Cover Image <span className="text-text-muted">(Optional)</span>
              </label>
              <label className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed py-3 transition-all
                ${coverImage
                  ? 'border-accent/60 bg-accent/5 hover:bg-accent/10'
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                } ${isLoading ? 'pointer-events-none opacity-60' : ''}`}>
                <Upload className={`h-4 w-4 ${coverImage ? 'text-accent' : 'text-text-secondary'}`} />
                <span className={`text-xs text-center px-2 truncate max-w-full ${coverImage ? 'text-accent' : 'text-text-secondary'}`}>
                  {coverImage ? coverImage.name : 'Upload Cover'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  disabled={isLoading}
                  onChange={e => setCoverImage(e.target.files[0] || null)}
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;