import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function finishLogin() {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");

        if (!access_token) {
          console.error("No token found in URL");
          navigate("/");
          return;
        }

        // Call backend to get/create user + issue JWT
        const res = await axios.post(`${API_URL}/api/auth/callback`, {
          access_token
        });

        const appToken = res.data?.token;
        if (!appToken) {
          console.error("No app token returned!");
          navigate("/");
          return;
        }

        // ⭐ IMPORTANT FIX FOR MOBILE ⭐
        // Save token BEFORE navigating (mobile loses it otherwise)
        localStorage.setItem("token", appToken);

        // Small delay to ensure write completes on mobile browsers
        setTimeout(() => {
          navigate("/home", { replace: true });
          window.location.reload();
        }, 50);

      } catch (err) {
        console.error("OAuth callback error:", err);
        navigate("/");
      }
    }

    finishLogin();
  }, [navigate]);

  return <div style={{ padding: 20 }}>Signing you in…</div>;
}
