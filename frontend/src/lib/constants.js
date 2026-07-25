// ─── Route Paths ────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  WATCH: (videoId) => `/watch/${videoId}`,
  WATCH_PARAM: '/watch/:videoId',
  SEARCH: '/search',
  CHANNEL: (username) => `/c/${username}`,
  CHANNEL_PARAM: '/c/:username',
  CHANNEL_VIDEOS: (username) => `/c/${username}/videos`,
  CHANNEL_PLAYLISTS: (username) => `/c/${username}/playlists`,
  CHANNEL_TWEETS: (username) => `/c/${username}/tweets`,
  PLAYLIST: (playlistId) => `/playlist/${playlistId}`,
  PLAYLIST_PARAM: '/playlist/:playlistId',
  LIKED_VIDEOS: '/liked-videos',
  HISTORY: '/history',
  SUBSCRIPTIONS: '/subscriptions',
  DASHBOARD: '/dashboard',
  UPLOAD: '/dashboard/upload',
  SETTINGS: '/settings',
}

// ─── Query Key Factories ─────────────────────────────────────────────────────

export const QUERY_KEYS = {
  // Auth
  currentUser: ['currentUser'],

  // Videos
  videos: (params) => ['videos', params],
  video: (videoId) => ['videos', videoId],

  // Comments
  comments: (videoId) => ['comments', videoId],

  // Likes
  likedVideos: ['likedVideos'],

  // Channel / User
  channel: (username) => ['channel', username],
  watchHistory: ['watchHistory'],

  // Subscriptions
  subscribedChannels: (userId) => ['subscribedChannels', userId],
  subscribers: (channelId) => ['subscribers', channelId],

  // Tweets
  tweets: (userId) => ['tweets', userId],

  // Playlists
  playlists: (userId) => ['playlists', userId],
  playlist: (playlistId) => ['playlists', playlistId],

  // Dashboard
  dashboardStats: ['dashboardStats'],
  dashboardVideos: ['dashboardVideos'],
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  COMMENTS_LIMIT: 10,
}

// ─── File Constraints ────────────────────────────────────────────────────────

export const FILE_LIMITS = {
  AVATAR_MAX_MB: 5,
  COVER_MAX_MB: 10,
  VIDEO_MAX_MB: 500,
  THUMBNAIL_MAX_MB: 5,
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ACCEPTED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
}
