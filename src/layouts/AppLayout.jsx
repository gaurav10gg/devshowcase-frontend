import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import MyProjects from "../pages/MyProjects";
import Settings from "../pages/Settings";
import About from "../pages/About";
import AppLayout from "../layouts/AppLayout";
import AuthCallback from "../pages/AuthCallback";
import ProjectPage from "../pages/ProjectPage"; // ✅ NEW IMPORT

// ------------------------------------
// Protected Route
// ------------------------------------
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/" replace />;
}
export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />

      {/* OAuth callback */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />

        {/* ✅ NEW PROJECT DETAILS PAGE */}
        <Route path="/project/:id" element={<ProjectPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
