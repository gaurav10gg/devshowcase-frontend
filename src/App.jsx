import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import AppRouter from "./router/AppRouter";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      // 1️⃣ Process OAuth redirect (v1)
      await supabase.auth.getSessionFromUrl();

      // 2️⃣ Check existing session
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        localStorage.setItem("token", data.session.access_token);
      }

      // 3️⃣ Listen for auth state changes
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
    };

    init();
  }, [navigate]);

  return <AppRouter />;
}
