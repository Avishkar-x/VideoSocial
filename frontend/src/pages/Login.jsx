import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlaySquare, Mail, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function Login() {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const { login } = useAuth()
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!identifier.trim()) {
            setError('Email or username is required.')
            return
        }
        if (!password) {
            setError('Password is required.')
            return
        }

        setIsSubmitting(true)
        try {
            const credentials = identifier.includes('@')
                ? { email: identifier, password }
                : { username: identifier, password }

            await login(credentials)
            navigate('/')
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed. Please try again.')
        }finally {
            console.log("LOGIN FINALLY")
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-bg-surface/50 p-8 shadow-xl backdrop-blur-md">

                <div className="mb-8 flex flex-col items-center justify-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                        <PlaySquare className="h-6 w-6 text-accent" />
                    </div>
                    <h1 className="mt-2 text-2xl font-bold text-text-primary">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Sign in to continue to VideoSocial
                    </p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <label
                            className="text-sm font-medium text-text-secondary"
                            htmlFor="identifier"
                        >
                            Email or Username
                        </label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
                                <Mail className="h-4 w-4" />
                            </div>

                            <input
                                id="identifier"
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent focus:bg-bg-elevated focus:ring-1 focus:ring-accent"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label
                                className="text-sm font-medium text-text-secondary"
                                htmlFor="password"
                            >
                                Password
                            </label>

                            <Link
                                to="#"
                                className="text-xs text-accent hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
                                <Lock className="h-4 w-4" />
                            </div>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent focus:bg-bg-elevated focus:ring-1 focus:ring-accent"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white ..."
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-text-secondary">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="font-medium text-accent hover:underline"
                    >
                        Sign up
                    </Link>
                </div>

                {/* Recruiter Demo Account */}
                <div className="mt-8 rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
                    <p className="text-sm font-semibold text-text-primary mb-2">Recruiter Demo Account</p>
                    <div className="flex flex-col text-sm text-text-secondary gap-1">
                        <p>Username: <span className="font-mono text-accent">maverick</span></p>
                        <p>Password: <span className="font-mono text-accent">12345678</span></p>
                    </div>
                    <p className="text-xs text-text-muted mt-3">Use these credentials to explore the application.</p>
                </div>
            </div>
        </div>
    )
}

export default Login