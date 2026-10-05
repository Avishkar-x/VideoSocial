# 🎥 VideoSocial

A full-stack video sharing platform inspired by YouTube, built using the MERN stack.

VideoSocial allows users to upload, watch, search, and interact with videos through features such as likes, comments, subscriptions, playlists, watch history, and channel profiles. Creators can manage their videos through a dedicated dashboard.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based authentication with Access + Refresh Tokens
- HTTP-only cookie-based session management
- User registration and login
- Login using username or email
- Persistent sessions
- Automatic access-token refresh
- Protected routes
- Change password
- Update profile information
- Avatar and cover image management
- Logout

### 🎬 Video Management
- Upload videos with thumbnails
- Video playback
- Edit videos
- Delete videos
- Publish / Unpublish videos
- Paginated video feed
- Video search by title and description
- Watch history
- View tracking

### 💬 Social Features
- Add, edit, and delete comments
- Like / Unlike videos
- Subscribe / Unsubscribe to channels
- View liked videos
- View subscribed channels
- View channel subscribers
- Channel profiles

### 📚 Playlists
- Create playlists
- Edit playlists
- Delete playlists
- Add videos to playlists
- Remove videos from playlists
- Save videos to playlists directly from the video card/watch page
- View playlist details

### 📊 Creator Dashboard
- Channel statistics
- View uploaded videos
- Edit videos
- Publish / Unpublish videos
- Delete videos
- Manage creator content

### ⚙️ Account Management
- Update account information
- Change password
- Update avatar
- Update cover image

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Cloudinary

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Hook Form
- React Hot Toast

---

## ✨ Backend Highlights

- RESTful API architecture
- JWT Access + Refresh Token authentication
- HTTP-only cookie-based session management
- Automatic token refresh
- File upload pipeline using Multer and Cloudinary
- MongoDB aggregation pipelines
- Modular MVC architecture
- Centralized error handling
- Custom API Response and Error utilities
- Owner-based authorization
- Pagination and filtering
- Search using MongoDB queries

---

## 📊 MongoDB Aggregations

MongoDB aggregation pipelines are used for features such as:

- Creator dashboard statistics
- Channel profiles
- Subscriber information
- Watch history
- User playlists
- Video-related data aggregation

Common aggregation operators include:

- `$lookup`
- `$group`
- `$project`
- `$facet`
- `$addFields`
- `$sort`
- `$match`

---

## ⚡ Frontend Highlights

- Protected routes
- Public landing page
- Responsive UI
- Reusable components
- Axios request/response interceptors
- Automatic access-token refresh
- Optimistic UI updates
- Loading and error states
- Toast notifications
- Search with URL query parameters
- Paginated video feed
- Video upload with multipart FormData

---

## 📁 Project Structure

```text
VideoSocial/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── api/
│   └── ...
│
└── README.md