import axiosInstance from "./axiosInstance";

export const getAllVideos = async (params)=>{
    const response = await axiosInstance.get("/videos", {params})
    return response.data
}

export const getVideoById = async (videoId) =>{
    const response = await axiosInstance.get(`/videos/${videoId}`)
    return response.data
}

export const publishVideo = async (formData) => {
    const response = await axiosInstance.post("videos", formData)
    return response.data
}

export const updateVideo = async (videoId, formData) => {
    const response = await axiosInstance.patch(`/videos/${videoId}`, formData)
    return response.data
}

export const deleteVideo = async (videoId) => {
    const response = await axiosInstance.delete(`/videos/${videoId}`)
    return response.data
}

export const togglePublishStatus = async (videoId) => {
    const response = await axiosInstance.patch(`/videos/toggle/publish/${videoId}`)
    return response.data
}