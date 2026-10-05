import axiosInstance from "./axiosInstance"

// POST /api/v1/playlist/  body: { name, description }
export const createPlaylist = async (name, description) => {
    const response = await axiosInstance.post("/playlist/", { name, description })
    return response.data
}

// GET /api/v1/playlist/:playlistId
export const getPlaylistById = async (playlistId) => {
    const response = await axiosInstance.get(`/playlist/${playlistId}`)
    return response.data
}

// GET /api/v1/playlist/user/:userId
export const getUserPlaylists = async (userId) => {
    const response = await axiosInstance.get(`/playlist/user/${userId}`)
    return response.data
}

// PATCH /api/v1/playlist/add/:videoId/:playlistId
export const addVideoToPlaylist = async (videoId, playlistId) => {
    const response = await axiosInstance.patch(`/playlist/add/${videoId}/${playlistId}`)
    return response.data
}

// PATCH /api/v1/playlist/remove/:videoId/:playlistId
export const removeVideoFromPlaylist = async (videoId, playlistId) => {
    const response = await axiosInstance.patch(`/playlist/remove/${videoId}/${playlistId}`)
    return response.data
}

// PATCH /api/v1/playlist/:playlistId  body: { name, description }
export const updatePlaylist = async (playlistId, name, description) => {
    const response = await axiosInstance.patch(`/playlist/${playlistId}`, { name, description })
    return response.data
}

// DELETE /api/v1/playlist/:playlistId
export const deletePlaylist = async (playlistId) => {
    const response = await axiosInstance.delete(`/playlist/${playlistId}`)
    return response.data
}
