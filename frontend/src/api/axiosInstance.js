import axios from 'axios'
import { tokenStore } from './tokenStore'

// ─── Instance ────────────────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Always send cookies (works when HTTPS; harmless over HTTP)
  timeout: 30_000,
})

// ─── Note on Response Shape ───────────────────────────────────────────────────
// Backend always returns: { statusCode, data, message, success }
// Consumers access the payload via: response.data.data (or response.data.data.docs etc.)
// We intentionally do NOT unwrap here so all hooks/pages receive the full axios response.

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attach Bearer token if one is in the store (local dev fallback).
// Over HTTPS, cookies carry the token; this header is redundant but safe
// (backend checks cookies first, then Authorization header).

axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStore.get()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── 401 Retry with Refresh ──────────────────────────────────────────────────

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only handle 401, and don't retry if:
    // - we already retried this request
    // - this IS the refresh-token request (avoid infinite loop)
    if (
      error?.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/users/refresh-token')
    ) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return axiosInstance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt token refresh
        // Over HTTPS: cookies are sent automatically (withCredentials)
        // Over HTTP: no cookie → this will fail → user sees login page
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true },
        )

        // Backend returns tokens in both cookies AND response body
        const newAccessToken = refreshResponse?.data?.data?.accessToken
        if (newAccessToken) {
          tokenStore.set(newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        processQueue(null, newAccessToken)
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        tokenStore.clear()

        // Dispatch a custom event so AuthContext can handle the logout
        window.dispatchEvent(new CustomEvent('auth:logout'))

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
