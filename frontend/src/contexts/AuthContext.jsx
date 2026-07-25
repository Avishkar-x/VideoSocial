import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { login as apiLogin, logout as apiLogout, refreshToken, getCurrentUser } from '../api/auth.api'
import { tokenStore } from '../api/tokenStore'
import queryClient from '../lib/queryClient'
import toast from 'react-hot-toast'

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const initialized = useRef(false)

  // ── Silent refresh on app mount ──────────────────────────────────────────
  // Attempts to exchange the refresh token cookie for a new access token.
  // Over HTTPS: cookies are sent automatically → succeeds.
  // Over HTTP (local dev): no cookie is present → fails → user must re-login.

  const initializeAuth = useCallback(async () => {
    try {
      // refreshToken endpoint returns axios response; payload is response.data.data = { accessToken, refreshToken }
      const res = await refreshToken()
      const newToken = res?.data?.data?.accessToken
      if (newToken) {
        tokenStore.set(newToken)
      }
      // getCurrentUser returns axios response; payload is response.data.data = user object
      const userRes = await getCurrentUser()
      setUser(userRes?.data?.data ?? null)
    } catch {
      // Expected in local dev (no cookies) or when no session exists.
      tokenStore.clear()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    initializeAuth()
  }, [initializeAuth])

  // ── Listen for forced logout from axios interceptor ──────────────────────
  useEffect(() => {
    function handleForcedLogout() {
      tokenStore.clear()
      setUser(null)
      queryClient.clear()
      toast.error('Your session has expired. Please log in again.')
    }

    window.addEventListener('auth:logout', handleForcedLogout)
    return () => window.removeEventListener('auth:logout', handleForcedLogout)
  }, [])

  // ── Login ────────────────────────────────────────────────────────────────

  const login = useCallback(async (credentials) => {
    const res = await apiLogin(credentials)
    // res is full axios response; payload is res.data.data = { user, accessToken, refreshToken }
    const data = res?.data?.data
    if (data?.accessToken) {
      tokenStore.set(data.accessToken)
    }
    setUser(data?.user ?? null)
    return data
  }, [])

  // ── Logout ───────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {
      // If the logout request fails, still clear local state
    } finally {
      tokenStore.clear()
      setUser(null)
      queryClient.clear()
    }
  }, [])

  // ── Update user state (used after profile edits) ─────────────────────────

  const updateUser = useCallback((updatedUser) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser))
  }, [])

  const value = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
