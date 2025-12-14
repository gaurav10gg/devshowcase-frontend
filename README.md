# DevShowcase

**A modern platform for developers to share, discover, and showcase their projects.**

DevShowcase is a full-stack web application where developers can post their projects, get feedback through likes and comments, and build their developer identity. Think of it as a social network specifically designed for developer portfolios.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Features Breakdown](#-features-breakdown)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Features
- **Google OAuth Authentication** via Supabase
- **Fully Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Persistent theme preference
- **Like System** - Like/unlike projects with real-time updates
- **Comments System** - Engage with developers through comments
- **Project Management** - Create, edit, and delete your projects
- **Image Upload** - Upload project thumbnails via Supabase Storage
- **User Profiles** - Customizable profiles with avatar, bio, and social links
- **Project Discovery** - Browse all projects with filtering options

### Technical Features
- **Optimistic UI Updates** - Instant feedback on user interactions
- **Real-time Data Sync** - React Query for efficient data fetching
- **Material-UI Components** - Modern, accessible UI components
- **Protected Routes** - Secure authentication flow
- **PostgreSQL Database** - Hosted on Neon
- **RESTful API** - Clean backend architecture

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **React Router v6** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Axios** - HTTP client
- **Supabase Client** - Authentication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database (Neon serverless)
- **Supabase** - Authentication & Storage
- **Multer** - File upload handling
- **pg** - PostgreSQL client

---

## 📁 Project Structure

```
devshowcase/
├── frontend/
│   ├── src/
│   │   ├── api/              # API service functions
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── CommentsModal.jsx
│   │   │   └── ProjectDetailsModal.jsx
│   │   ├── context/          # React Context providers
│   │   │   └── ThemeContext.jsx
│   │   ├── layouts/          # Layout components
│   │   │   └── AppLayout.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── MyProjects.jsx
│   │   │   ├── ProjectPage.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── About.jsx
│   │   │   └── AuthCallback.jsx
│   │   ├── router/           # Routing configuration
│   │   │   └── AppRouter.jsx
│   │   ├── App.jsx           # Root component
│   │   ├── main.jsx          # Entry point
│   │   ├── config.js         # Configuration
│   │   └── supabaseClient.js # Supabase initialization
│   └── package.json
│
├── backend/
│   ├── middleware/           # Express middleware
│   │   ├── requireAuth.js
│   │   └── requireAuthOptional.js
│   ├── routes/               # API routes
│   │   ├── users.js
│   │   ├── projects.js
│   │   ├── comments.js
│   │   └── upload.js
│   ├── db.js                 # Database connection
│   ├── supabase.js           # Supabase server config
│   ├── server.js             # Express server
│   └── package.json
│
└── README.md
```

---
## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** account (Neon recommended)
- **Supabase** account (for authentication and storage)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/devshowcase.git
cd devshowcase
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

## 🔑 Environment Variables

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DATABASE_URL=your_neon_postgresql_connection_string

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
```

---

## 🗄️ Database Setup

### Database Schema

Run the following SQL commands in your PostgreSQL database (Neon):

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  bio TEXT,
  avatar TEXT,
  github VARCHAR(255),
  linkedin VARCHAR(255),
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  short_desc TEXT,
  full_desc TEXT,
  image TEXT,
  github VARCHAR(255),
  live VARCHAR(255),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Votes (likes) table
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Comments table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_votes_project_id ON votes(project_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_comments_project_id ON comments(project_id);
```

### Supabase Storage Setup

1. Go to your Supabase dashboard
2. Navigate to **Storage**
3. Create two buckets:
   - `project-images` (public)
   - `avatars` (public)
4. Set both buckets to **public** access

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

---

## 🌐 API Endpoints

### Authentication
- Uses Supabase OAuth with Google provider

### Users
- `POST /api/users` - Create/sync user
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users` - Get all users

### Projects
- `GET /api/projects` - Get all projects (with optional auth)
- `GET /api/projects/me` - Get current user's projects (auth required)
- `GET /api/projects/:id` - Get single project by ID
- `POST /api/projects` - Create new project (auth required)
- `PATCH /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

### Likes
- `POST /api/projects/:id/like` - Like a project (auth required)
- `DELETE /api/projects/:id/like` - Unlike a project (auth required)

### Comments
- `GET /api/comments/:projectId` - Get comments for a project
- `POST /api/comments/:projectId` - Add comment (auth required)
- `DELETE /api/comments/:commentId` - Delete comment (auth required)

### Upload
- `POST /api/upload` - Upload project image (auth required)
- `POST /api/upload/avatar` - Upload user avatar (auth required)

---

## 🎯 Features Breakdown

### 1. Authentication Flow
- User clicks "Sign In with Google"
- Redirected to Google OAuth via Supabase
- After authentication, redirected to `/auth/callback`
- Token stored in localStorage
- User data synced to PostgreSQL database

### 2. Like System
- **Optimistic Updates:** UI updates immediately before server response
- **Database Tracking:** Votes stored in `votes` table with unique constraint
- **Real-time Counts:** Like counts updated on every action
- **Persistent State:** Liked status persists across page reloads

### 3. Comments System
- Real-time comment posting
- Display user name with each comment
- Delete own comments (future feature)

### 4. Project Management
- Create projects with title, descriptions, images, and links
- Upload images to Supabase Storage
- Edit and delete your own projects
- Tag system for categorization

### 5. Dark Mode
- Theme preference stored in localStorage
- Persists across sessions
- Affects entire app including mobile browser UI
- Resets to light mode on logout

### 6. Responsive Design
- Mobile-first approach
- Sidebar navigation on desktop
- Drawer navigation on mobile
- Adaptive layouts for all screen sizes

---

## 🎨 UI/UX Features

### Desktop Experience
- Sidebar navigation with active route highlighting
- Top bar with user avatar and logout
- Grid layout for project cards
- Modal dialogs for project details and comments

### Mobile Experience
- Collapsible drawer navigation
- Full-width buttons for better touch targets
- Optimized typography and spacing
- Mobile logout button in sidebar
- Responsive project grid (1 column on mobile)

### Dark Mode Design
- GitHub-inspired dark theme
- Proper contrast ratios for accessibility
- Dark mobile browser UI bar
- Smooth theme transitions

---

## 🔐 Security Features

- **JWT Authentication:** Supabase handles token generation
- **Protected Routes:** Client-side route protection
- **Server-side Auth:** Middleware validates tokens on backend
- **User Ownership:** Users can only edit/delete their own content
- **SQL Injection Prevention:** Parameterized queries
- **XSS Protection:** React's built-in sanitization

---

## 🚧 Future Enhancements

- [ ] Search and filter projects
- [ ] User profiles with project portfolio
- [ ] Follow system
- [ ] Notifications
- [ ] Project analytics
- [ ] Social sharing
- [ ] Email notifications
- [ ] Advanced tagging and categories
- [ ] Project showcase page
- [ ] Trending projects algorithm

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Made with ❤️ by Gaurav**
