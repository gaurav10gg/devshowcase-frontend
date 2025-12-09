import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import AppRouter from "./router/AppRouter";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // restore session on load
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        localStorage.setItem("token", data.session.access_token);
      }
    });

    // listen for login / logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          if (session?.access_token) {
            localStorage.setItem("token", session.access_token);
          }
          navigate("/home", { replace: true });
        }

        if (event === "SIGNED_OUT") {
          localStorage.removeItem("token");
          navigate("/", { replace: true });
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return <AppRouter />;
}
