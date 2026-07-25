/**
 * Token Store — module-scoped access token variable.
 *
 * The access token lives here (not in React state) so that
 * Axios interceptors can read/write it without needing React Context.
 *
 * In production (HTTPS): httpOnly cookies handle auth automatically.
 *   The token variable stays null and Authorization header is not set.
 * In local dev (HTTP): cookies are dropped by the browser (secure: true),
 *   so the access token from the login response body is stored here and
 *   sent via Authorization: Bearer header.
 *
 * The refresh token is NEVER stored client-side.
 * Page refresh in local dev requires re-login — accepted trade-off.
 */

let _accessToken = null

export const tokenStore = {
  /** @returns {string|null} */
  get() {
    return _accessToken
  },

  /** @param {string|null} token */
  set(token) {
    _accessToken = token
  },

  clear() {
    _accessToken = null
  },
}
