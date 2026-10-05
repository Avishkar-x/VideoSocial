import axiosInstance from "./axiosInstance"

// GET /api/v1/dashboard/stats  → channel stats for current user
export const getChannelStats = async () => {
    const response = await axiosInstance.get("/dashboard/stats")
    return response.data
}

// GET /api/v1/dashboard/videos  → all videos owned by current user
export const getChannelVideos = async () => {
    const response = await axiosInstance.get("/dashboard/videos")
    return response.data
}
