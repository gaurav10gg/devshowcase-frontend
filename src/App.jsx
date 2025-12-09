import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import AppRouter from "./router/AppRouter";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth redirect tokens
    const processOAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
        return;
      }

      if (data?.session) {
        // Save token
        localStorage.setItem("token", data.session.access_token);

        // Redirect to home after login
        navigate("/home", { replace: true });
      }
    };

    // Listen for login/logout events
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        localStorage.setItem("token", session.access_token);
        navigate("/home", { replace: true });
      }

      if (event === "SIGNED_OUT") {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      }
    });

    processOAuthRedirect();
  }, []);

  return <AppRouter />;
}
