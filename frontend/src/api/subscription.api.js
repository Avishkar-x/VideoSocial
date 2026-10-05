import axiosInstance from "./axiosInstance"

// POST /api/v1/subscriptions/c/:channelId  → { data: { subscribed: boolean } }
export const toggleSubscription = async (channelId) => {
    const response = await axiosInstance.post(`/subscriptions/c/${channelId}`)
    return response.data
}

// GET /api/v1/subscriptions/u/:subscriberId  → { data: [ { _id, channel: {...}, createdAt } ] }
export const getSubscribedChannels = async (subscriberId) => {
    const response = await axiosInstance.get(`/subscriptions/u/${subscriberId}`)
    return response.data
}

// GET /api/v1/subscriptions/c/:channelId  → { data: [ { _id, subscriber: {...}, createdAt } ] }
export const getUserChannelSubscribers = async (channelId) => {
    const response = await axiosInstance.get(`/subscriptions/c/${channelId}`)
    return response.data
}

