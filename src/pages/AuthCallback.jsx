import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        localStorage.setItem("token", session.access_token);
        navigate("/home", { replace: true });
      } else {
        console.log("No session found.");
        navigate("/", { replace: true });
      }
    };

    handleSession();
  }, [navigate]);

  return <div>Loading...</div>;
}
