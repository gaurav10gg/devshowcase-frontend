import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import axios from "axios";

import Landing from "../pages/Landing";
import Home from "../pages/Home";
import MyProjects from "../pages/MyProjects";
import Settings from "../pages/Settings";
import About from "../pages/About";

import AppLayout from "../layouts/AppLayout"; // your folder name is layouts

// ------------------------------------
// Sync Supabase user → backend users table
// ------------------------------------
async function syncUserToBackend() {
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) return;

  const token = localStorage.getItem("token");

  try {
    await axios.post(
      "http://localhost:5000/api/users",
      {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name ?? "Unknown",
      },
      token
        ? { headers: { Authorization: "Bearer " + token } }
        : undefined
    );
  } catch (err) {
    console.log("User sync failed:", err);
  }
}

// ------------------------------------
// Protected Route
// ------------------------------------
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

export default function AppRouter() {
  const navigate = useNavigate(); // ⭐ added

  useEffect(() => {
    // try to sync user if already logged in
    syncUserToBackend();

    // listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.access_token) {
          localStorage.setItem("token", session.access_token);

          await syncUserToBackend();

          // ⭐ FIX: redirect to home after login
          navigate("/home", { replace: true });
        } else {
          localStorage.removeItem("token");

          // keep user on landing page after logout
          navigate("/", { replace: true });
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Landing />} />

      {/* Protected layout & routes */}
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
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
