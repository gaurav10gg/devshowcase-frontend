import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { API_URL } from "../config";

export default function OAuthConnect() {
  const [params] = useSearchParams();
  const redirect_uri = params.get("redirect_uri");
  const state = params.get("state");
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data?.session) {
        // not logged in → trigger Google login, come back here after
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/oauth-connect?redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}`,
          },
        });
        return;
      }

      // logged in → exchange token for code → redirect back to ChatGPT
      setStatus("linking");
      try {
        const res = await axios.post(`${API_URL}/oauth/callback`, {
          access_token: data.session.access_token,
          redirect_uri,
          state,
        });

        // redirect user back to ChatGPT
        window.location.href = res.data.redirect_url;
      } catch {
        setStatus("error");
      }
    };

    if (redirect_uri && state) run();
    else setStatus("error");
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 10, gap: 2 }}>
      {status === "checking" && (
        <><CircularProgress /><Typography>Checking your account...</Typography></>
      )}
      {status === "linking" && (
        <><CircularProgress /><Typography>Connecting to ChatGPT...</Typography></>
      )}
      {status === "error" && (
        <Typography color="error">Something went wrong. Please try again.</Typography>
      )}
    </Box>
  );
}