# 🎥 VideoSocial

A full-stack video sharing platform inspired by YouTube, built using the MERN stack. The application supports secure authentication, video uploads, social interactions, playlist management, and creator dashboards with a scalable REST API architecture.

---

## 🚀 Features

### Authentication
- JWT-based Authentication (Access + Refresh Tokens)
- Secure HTTP-only Cookie Authentication
- User Registration & Login
- Persistent Sessions
- Change Password
- Update Profile, Avatar & Cover Image

### Video Management
- Upload Videos with Thumbnail
- Edit & Delete Videos
- Publish / Unpublish Videos
- Watch Videos
- Search Videos
- Paginated Video Feed
- Watch History

### Social Features
- Comments
- Like / Unlike Videos
- Like / Unlike Comments
- Channel Subscriptions
- Tweets (Community Posts)
- Liked Videos

### Playlist
- Create, Edit & Delete Playlists
- Add / Remove Videos
- Save Videos directly from Watch Page

### Creator Dashboard
- Channel Statistics
- Video Management
- Analytics using MongoDB Aggregation Pipelines

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary

### Frontend
- React 19
- Vite
- React Router DOM
- TanStack Query
- Axios
- Tailwind CSS v4
- React Hook Form
- React Hot Toast

---

## ✨ Backend Highlights

- 50+ RESTful API Endpoints
- JWT Access & Refresh Token Authentication
- Secure Cookie-based Session Management
- File Upload Pipeline using Multer & Cloudinary
- Advanced MongoDB Aggregation Pipelines
- Modular MVC Architecture
- Centralized Error Handling
- Custom API Response & Error Utilities
- Optimized Database Queries

---

## 📊 MongoDB Aggregations

Used aggregation pipelines for:

- Creator Dashboard Statistics
- Channel Profiles
- Subscriber Counts
- Watch History
- User Playlists
- Recommended Videos
- Personalized Video Feeds

Using operators such as:

- `$lookup`
- `$group`
- `$project`
- `$facet`
- `$addFields`
- `$sort`
- `$match`

---

## ⚡ Frontend Highlights

- Protected Routes
- Lazy Loaded Pages
- React Query Data Fetching & Caching
- Optimistic UI Updates
- Responsive Design
- Reusable UI Components
- Axios Interceptors with Automatic Token Refresh
- Skeleton Loaders & Toast Notifications

---

## 📁 Project Structure

```
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
│   ├── hooks/
│   ├── api/
│   └── ...
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd VideoSocial
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

### Backend

```
PORT=
MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CORS_ORIGIN=
```

### Frontend

```
VITE_API_BASE_URL=
```

---

## 📸 Screenshots

_Add application screenshots here._

---

## 📌 Future Improvements

- Video Recommendations
- Notifications
- Infinite Scrolling
- Video Categories
- Live Streaming
- Real-time Chat

---

## 👨‍💻 Author

**Avishkar Mali**
