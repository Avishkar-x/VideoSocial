import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import MainLayout from './layouts/MainLayout.jsx'
import AuthLayout from './layouts/AuthLayout.jsx'

// Locked modules (student-implemented)
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import UploadVideo from './pages/UploadVideo.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Search from './pages/Search.jsx'

// New pages
import WatchVideo from './pages/WatchVideo.jsx'
import ChannelProfile from './pages/ChannelProfile.jsx'
import WatchHistory from './pages/WatchHistory.jsx'
import LikedVideos from './pages/LikedVideos.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AccountSettings from './pages/AccountSettings.jsx'
import MyPlaylists from './pages/MyPlaylists.jsx'
import PlaylistDetail from './pages/PlaylistDetail.jsx'
import Subscribers from './pages/Subscribers.jsx'
import Subscriptions from './pages/Subscriptions.jsx'
import LandingPage from './pages/LandingPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <LandingPage />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'home',
            element: <Home />
          },
          {
            path: 'upload',
            element: <UploadVideo />
          },
          {
            path: 'search',
            element: <Search />
          },
          {
            path: 'watch/:videoId',
            element: <WatchVideo />
          },
          {
            path: 'c/:username',
            element: <ChannelProfile />
          },
          {
            path: 'history',
            element: <WatchHistory />
          },
          {
            path: 'liked',
            element: <LikedVideos />
          },
          {
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'account',
            element: <AccountSettings />
          },
          {
            path: 'playlists',
            element: <MyPlaylists />
          },
          {
            path: 'playlists/:playlistId',
            element: <PlaylistDetail />
          },
          {
            path: 'subscribers',
            element: <Subscribers />
          },
          {
            path: 'subscriptions',
            element: <Subscriptions />
          }
        ]
      }
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App