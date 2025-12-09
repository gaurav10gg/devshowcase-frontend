import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import AppRouter from "./router/AppRouter";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check session when app loads
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        localStorage.setItem("token", data.session.access_token);
      }
    };

    // Listen for login events from Supabase
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        localStorage.setItem("token", session.access_token);
        navigate("/home");
      }

      if (event === "SIGNED_OUT") {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      }
    });

    // ⭐ IMPORTANT: process OAuth redirect hash (#access_token=...)
    supabase.auth.getSessionFromUrl({ storeSession: true });

    checkSession();
  }, []);

  return <AppRouter />;
}
