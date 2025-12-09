import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import AppRouter from "./router/AppRouter";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Handle Google OAuth redirect (PKCE flow)
    const handleOAuthCallback = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (!error && data?.session) {
        localStorage.setItem("token", data.session.access_token);
        navigate("/home", { replace: true });
      }
    };

    handleOAuthCallback();

    // 🔹 On load, restore existing session
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        localStorage.setItem("token", data.session.access_token);
      }
    };

    loadSession();

    // 🔹 Listen for sign in/out
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        localStorage.setItem("token", session.access_token);
        navigate("/home", { replace: true });
      }

      if (event === "SIGNED_OUT") {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      }
    });
  }, []);

  return <AppRouter />;
}
