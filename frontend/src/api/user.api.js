import axiosInstance from "./axiosInstance"

// GET /api/v1/users/c/:username  → channel profile with sub counts
export const getChannelProfile = async (username) => {
    const response = await axiosInstance.get(`/users/c/${username}`)
    return response.data
}

// GET /api/v1/users/history
export const getWatchHistory = async () => {
    const response = await axiosInstance.get("/users/history")
    return response.data
}

// PATCH /api/v1/users/update-account  body: { fullName, email }
export const updateAccountDetails = async (fullName, email) => {
    const response = await axiosInstance.patch("/users/update-account", { fullName, email })
    return response.data
}

// POST /api/v1/users/change-password  body: { oldPassword, newPassword }
export const changePassword = async (oldPassword, newPassword) => {
    const response = await axiosInstance.post("/users/change-password", { oldPassword, newPassword })
    return response.data
}

// PATCH /api/v1/users/avatar  multipart/form-data, field: avatar
export const updateAvatar = async (formData) => {
    const response = await axiosInstance.patch("/users/avatar", formData)
    return response.data
}

// PATCH /api/v1/users/cover-image  multipart/form-data, field: coverImage
export const updateCoverImage = async (formData) => {
    const response = await axiosInstance.patch("/users/cover-image", formData)
    return response.data
}
