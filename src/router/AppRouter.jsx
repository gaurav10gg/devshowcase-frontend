import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import MyProjects from "../pages/MyProjects";
import Settings from "../pages/Settings";
import About from "../pages/About";
import AppLayout from "../layouts/AppLayout";
import AuthCallback from "../pages/AuthCallback";
import ProjectPage from "../pages/ProjectPage";
import GptConnect from "../pages/GptConnect";
import OAuthConnect from "../pages/OAuthConnect";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/gpt-connect" element={<GptConnect />} />
      <Route path="/oauth-connect" element={<OAuthConnect />} />

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
        <Route path="/project/:id" element={<ProjectPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}