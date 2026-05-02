import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { API_URL } from "../config";

export default function GptConnect() {
  const [params] = useSearchParams();
  const sid = params.get("sid");
  const [status, setStatus] = useState("checking"); // checking | linking | done | error

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data?.session) {
        // not logged in → go to Google login, come back here after
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/gpt-connect?sid=${sid}`,
          },
        });
        return;
      }

      // logged in → link the session
      setStatus("linking");
      try {
        await axios.post(
          `${API_URL}/api/gpt/link`,
          { sid },
          { headers: { Authorization: `Bearer ${data.session.access_token}` } }
        );
        setStatus("done");
        setTimeout(() => window.location.href = "https://chat.openai.com", 1500);
      } catch {
        setStatus("error");
      }
    };

    if (sid) run();
    else setStatus("error");
  }, [sid]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 10, gap: 2 }}>
      {status === "checking" && <><CircularProgress /><Typography>Checking login...</Typography></>}
      {status === "linking" && <><CircularProgress /><Typography>Linking your account...</Typography></>}
      {status === "done" && <Typography variant="h6" color="success.main">✅ Account linked! Redirecting back to ChatGPT...</Typography>}
      {status === "error" && <Typography color="error">Something went wrong. Invalid or expired link.</Typography>}
    </Box>
  );
}