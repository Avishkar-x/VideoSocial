import axios from 'axios'
import { getAccessToken,setAccessToken,removeAccessToken } from './tokenStore'
let isRefreshing = false
let failedQueue = []

const axiosInstance = axios.create({
    baseURL:'http://localhost:8000/api/v1',
    withCredentials: true
})

axiosInstance.interceptors.request.use((config) =>{
    const token = getAccessToken()
    if(token) config.headers.Authorization =  `Bearer ${token}` 


    return config
})

function processQueue(error, token = null) {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error)
        } else {
            promise.resolve(token)
        }
    })

    failedQueue = []
}
axiosInstance.interceptors.response.use(
    (response) =>{
        return response
    },
    async (error) =>{
        const originalRequest = error.config
        if(error?.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/users/refresh-token') && !originalRequest.url.includes('/users/login')) 
        {
            if (isRefreshing) {
            // Queue this request until refresh completes
            return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
            })
            .then((token) => {
                if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`
                }
                return axiosInstance(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            const refreshResponse = await axios.post(
                'http://localhost:8000/api/v1/users/refresh-token',
                {},
                {withCredentials:true}
            )

            const newAccessToken = refreshResponse?.data?.data?.accessToken

            if(newAccessToken)
            {
                setAccessToken(newAccessToken)
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            }
            processQueue(null, newAccessToken)
            return axiosInstance(originalRequest)
        } catch (refreshError) {
            processQueue(refreshError,null)
            removeAccessToken()

            return Promise.reject(refreshError)
        }finally{
            isRefreshing = false
        }
        }
        return Promise.reject(error)
    }
)

export default axiosInstance