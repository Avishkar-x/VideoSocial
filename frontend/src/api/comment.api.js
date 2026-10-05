import axiosInstance from "./axiosInstance"

// GET /api/v1/comments/:videoId?page=&limit=
export const getVideoComments = async (videoId, params) => {
    const response = await axiosInstance.get(`/comments/${videoId}`, { params })
    return response.data
}

// POST /api/v1/comments/:videoId  body: { content }
export const addComment = async (videoId, content) => {
    const response = await axiosInstance.post(`/comments/${videoId}`, { content })
    return response.data
}

// PATCH /api/v1/comments/c/:commentId  body: { content }
export const updateComment = async (commentId, content) => {
    const response = await axiosInstance.patch(`/comments/c/${commentId}`, { content })
    return response.data
}

// DELETE /api/v1/comments/c/:commentId
export const deleteComment = async (commentId) => {
    const response = await axiosInstance.delete(`/comments/c/${commentId}`)
    return response.data
}
