import axiosInstance from "./axiosInstance"

// POST /api/v1/likes/toggle/v/:videoId  → { data: { liked: boolean } }
export const toggleVideoLike = async (videoId) => {
    const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`)
    return response.data
}

// POST /api/v1/likes/toggle/c/:commentId  → { data: { liked: boolean } }
export const toggleCommentLike = async (commentId) => {
    const response = await axiosInstance.post(`/likes/toggle/c/${commentId}`)
    return response.data
}

// GET /api/v1/likes/videos  → { data: [ { _id, video: { ... owner: {...} }, createdAt } ] }
export const getLikedVideos = async () => {
    const response = await axiosInstance.get("/likes/videos")
    return response.data
}
