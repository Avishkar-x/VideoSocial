import { useAuth } from '../contexts/AuthContext'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function ProtectedRoute() {
    const { isLoading, isAuthenticated } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        )
    }

    return <Outlet />
}

export default ProtectedRoute