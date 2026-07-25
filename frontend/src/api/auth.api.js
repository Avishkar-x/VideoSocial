import axiosInstance from './axiosInstance'

/**
 * Register a new user.
 * @param {FormData} formData - Must include: fullName, email, username, password, avatar, coverImage?
 */
export function register(formData) {
  return axiosInstance.post('/users/register', formData)
}

/**
 * Login with email/username and password.
 * @param {{ email?: string, username?: string, password: string }} credentials
 * @returns {Promise<{ user, accessToken, refreshToken }>}
 */
export function login(credentials) {
  return axiosInstance.post('/users/login', credentials)
}

/**
 * Logout the current user. Clears cookies server-side.
 */
export function logout() {
  return axiosInstance.post('/users/logout')
}

/**
 * Silently refresh the access token using the httpOnly refresh token cookie.
 * Over HTTP (local dev) this will fail — expected behaviour.
 * @returns {Promise<{ accessToken, refreshToken }>}
 */
export function refreshToken() {
  return axiosInstance.post('/users/refresh-token')
}

/**
 * Fetch the current authenticated user's profile.
 * @returns {Promise<User>}
 */
export function getCurrentUser() {
  return axiosInstance.get('/users/current-user')
}
