import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const url = window.location.href;

      // Exchange the auth code → Supabase session
      const { data, error } = await supabase.auth.exchangeCodeForSession(url);

      if (error) {
        console.error("OAuth Error:", error);
        return navigate("/", { replace: true });
      }

      // Save token & redirect
      if (data?.session) {
        localStorage.setItem("token", data.session.access_token);
        navigate("/home", { replace: true });
      }
    };

    finishLogin();
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontSize: "1.4rem",
        fontWeight: "600",
      }}
    >
      Signing you in…
    </div>
  );
}
