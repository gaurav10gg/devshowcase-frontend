import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const { data } = await supabase.auth.getSession();

      if (data?.session) {
        localStorage.setItem("token", data.session.access_token);
        navigate("/home", { replace: true });
      } else {
        console.log("No session found yet, retrying…");
        setTimeout(finishLogin, 200); // wait for Supabase to parse hash
      }
    };

    finishLogin();
  }, [navigate]);

  return <div>Loading...</div>;
}
