import axiosInstance from "./axiosInstance"

export const login = async (data) =>{
    const response = await axiosInstance.post('/users/login', data)

    return response.data
}

// form data is manually handled by axios
export const register = async (formData) =>{
    const response = await axiosInstance.post('/users/register', formData)

    return response.data
}

export const logout = async () =>{
    const response = await axiosInstance.post('/users/logout')

    return response.data
}

export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/users/current-user')

    return response.data
}

export const refreshToken = async () => {
  const response = await axiosInstance.post("/users/refresh-token");

  return response.data;
};