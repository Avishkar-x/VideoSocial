import { createContext, useContext, useState, useEffect } from "react"
import { login as apiLogin , logout as apiLogout, getCurrentUser, refreshToken} from "../api/auth.api"
import { removeAccessToken, setAccessToken } from "../api/tokenStore"
export const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
    const initializeAuth = async () => {
        try {
            const res = await refreshToken()
            const newAccessToken = res?.data?.accessToken
            if(newAccessToken){
                setAccessToken(newAccessToken)
                const currUser = await getCurrentUser()
                setUser(currUser.data)
            }
        } catch (error) {
            removeAccessToken()
        } finally {
            setIsLoading(false)
        }
    }

    initializeAuth()
    }, [])
    const login = async (credentials) =>{
        const res = await apiLogin(credentials)

        const data = res.data

        if(data?.accessToken)
        {
            setAccessToken(data.accessToken)
        }
        setUser(data.user?? null)

        return data
    }
    const logout = async()=>{
        try {
            await apiLogout()
    
            
        } catch (error) {
            
        }
        finally{
            removeAccessToken()
            setUser(null)
        }
    }
    const updateUser = (updatedUser) => {
    setUser((prev) => ({
        ...prev,
        ...updatedUser
    }))
}
    const value = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        updateUser
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}