import {
  Box,
  Button,
  Typography,
  Container,
  Stack,
  Paper,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { supabase } from "../supabaseClient";

export default function Landing() {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        flowType: "pkce",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) console.error("Google login error:", error);
  };

  return (
    <>
      <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh" }}>
        <Navbar onSignIn={handleSignIn} />

        {/* ---------- HERO ---------- */}
        <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 18 }, pb: 8 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 5, md: 8 }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  lineHeight: { xs: 1.25, md: 1.15 },
                  mb: { xs: 2.5, md: 3 },
                  fontSize: { xs: "2rem", sm: "2.3rem", md: "3.8rem" },
                  letterSpacing: "-1px",
                }}
              >
                Build. Share. Inspire.
                <br />
                <span style={{ color: "#1976d2" }}>
                  Showcase Your Dev Projects
                </span>
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  mb: { xs: 4, md: 5 },
                  maxWidth: "570px",
                  fontWeight: 400,
                  lineHeight: 1.55,
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                }}
              >
                A modern space for developers to share what they're building,
                discover new ideas, and connect with makers around the world.
              </Typography>

              {/* ---------- BUTTONS ---------- */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 2 }}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: { xs: 2.5, sm: 4 },
                    py: { xs: 1, sm: 1.4 },
                    borderRadius: { xs: "10px", sm: "12px" },
                    fontWeight: 600,
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                    textTransform: "none",
                    width: { xs: "100%", sm: "auto" },
                    backgroundColor: "#1976d2",
                    boxShadow: "0 4px 14px rgba(25,118,210,0.3)",
                    "&:hover": {
                      backgroundColor: "#145a9e",
                    },
                  }}
                  onClick={handleSignIn}
                >
                  Sign In with Google
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: { xs: 2.5, sm: 4 },
                    py: { xs: 1, sm: 1.4 },
                    borderRadius: { xs: "10px", sm: "12px" },
                    fontWeight: 600,
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                    textTransform: "none",
                    width: { xs: "100%", sm: "auto" },
                    borderColor: "#1976d2",
                    color: "#1976d2",
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Box>

            {/* ---------- HERO IMAGE ---------- */}
            <Box
              component="img"
              src="https://img.freepik.com/free-vector/coding-concept-illustration_114360-1678.jpg"
              alt="hero illustration"
              sx={{
                width: { xs: "100%", md: "480px" },
                borderRadius: 3,
                display: { xs: "none", md: "block" },
                boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
                objectFit: "cover",
              }}
            />
          </Stack>
        </Container>

        {/* ---------- FEATURES ---------- */}
        <Box sx={{ bgcolor: "#fff", py: { xs: 6, md: 10 } }}>
          <Container maxWidth="md">
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                textAlign: "center",
                mb: { xs: 4, md: 6 },
                letterSpacing: "-0.5px",
                fontSize: { xs: "1.8rem", md: "2.3rem" },
              }}
            >
              Why Join DevShowcase?
            </Typography>

            <Stack spacing={{ xs: 2.5, md: 4 }} alignItems="center">
              {[
                {
                  title: "Share Your Projects",
                  desc: "Post and showcase your creations beautifully so the world can see what you're building.",
                },
                {
                  title: "Engage & Get Feedback",
                  desc: "Like, comment, and interact with developers. Improve through real feedback.",
                },
                {
                  title: "Build Your Developer Identity",
                  desc: "Create a project portfolio and let your work speak for itself.",
                },
              ].map((feature, i) => (
                <Paper
                  key={i}
                  elevation={3}
                  sx={{
                    p: { xs: 2.5, sm: 4 },
                    width: "100%",
                    maxWidth: "750px",
                    borderRadius: { xs: 3, sm: 4 },
                    transition: "0.2s ease",
                    "&:hover": {
                      transform: { sm: "translateY(-4px)" },
                      boxShadow: "0px 12px 32px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      mb: 1,
                      fontSize: { xs: "1.05rem", sm: "1.2rem" },
                      color: "#1976d2",
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                  >
                    {feature.desc}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* ---------- FOOTER ---------- */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#000",
          color: "white",
          pt: 6,
          pb: 4,
          textAlign: "center",
          borderTop: "3px solid",
          borderImage: "linear-gradient(90deg, #1976d2, #6a11cb) 1",
        }}
      >
        <Typography sx={{ opacity: 0.6, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
          DevShowcase © 2025 — Made with ❤️ by Gaurav
        </Typography>
      </Box>
    </>
  );
}
