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
  // ⭐ Correct Google Login Handler (Hosted OAuth Mode)
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Use SUPABASE-HOSTED CALLBACK — REQUIRED FOR YOUR PROJECT
          redirectTo: "http://localhost:5173/home",
      },
    });

    if (error) console.error("Google login error:", error);
  };

  return (
    <>
      {/* PAGE WRAPPER */}
      <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", pb: 0, mb: 0 }}>
        {/* NAVBAR */}
        <Navbar onSignIn={handleSignIn} />

        {/* HERO SECTION */}
        <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 18 }, pb: 10, mb: 0 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={8}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* LEFT SIDE CONTENT */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  lineHeight: 1.15,
                  mb: 3,
                  fontSize: { xs: "2.3rem", md: "3.8rem" },
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
                  mb: 5,
                  maxWidth: "570px",
                  fontWeight: 400,
                  lineHeight: 1.55,
                }}
              >
                A modern space for developers to share what they're building,
                discover new ideas, and connect with makers around the world.
              </Typography>

              <Stack direction="row" spacing={2}>
                {/* ⭐ Google Login Button (Works now) */}
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.4,
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    backgroundColor: "#1976d2",
                    boxShadow: "0 4px 14px rgba(25,118,210,0.3)",
                    "&:hover": {
                      backgroundColor: "#145a9e",
                      boxShadow: "0 6px 20px rgba(25,118,210,0.35)",
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
                    px: 4,
                    py: 1.4,
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    "&:hover": {
                      borderColor: "#145a9e",
                      backgroundColor: "rgba(25,118,210,0.06)",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Box>

            {/* RIGHT HERO IMAGE */}
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

        {/* FEATURES SECTION */}
        <Box sx={{ bgcolor: "#fff", py: 10, mb: 0 }}>
          <Container maxWidth="md">
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                textAlign: "center",
                mb: 6,
                letterSpacing: "-0.5px",
                fontSize: { xs: "2rem", md: "2.3rem" },
              }}
            >
              Why Join DevShowcase?
            </Typography>

            <Stack spacing={4} alignItems="center">
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
                    p: 4,
                    width: "100%",
                    maxWidth: "750px",
                    borderRadius: 4,
                    transition: "0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0px 12px 32px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 1.5, color: "#1976d2" }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* FOOTER */}
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
        <Typography sx={{ opacity: 0.6, fontSize: "0.9rem" }}>
          DevShowcase © 2025 — Made with ❤️ by Gaurav
        </Typography>
      </Box>
    </>
  );
}
