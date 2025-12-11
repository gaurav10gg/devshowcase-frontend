import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const { data } = await supabase.auth.getSession();

      if (data?.session) {
        localStorage.setItem("token", data.session.access_token);
        navigate("/home", { replace: true });
      } else {
        setTimeout(finishLogin, 200); // keep retrying
      }
    };

    finishLogin();
  }, [navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#e8f0fe", // 🔵 light blue background
        gap: 2,
      }}
    >
      <CircularProgress size={42} sx={{ color: "#2563eb" }} /> 
      <Typography sx={{ fontSize: 18, color: "#2563eb", fontWeight: 600 }}>
        Authenticating…
      </Typography>
    </Box>
  );
}
