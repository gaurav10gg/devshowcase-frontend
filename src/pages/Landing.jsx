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
      <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", pb: 0, mb: 0 }}>
        <Navbar onSignIn={handleSignIn} />

        <Container 
          maxWidth="lg" 
          sx={{ 
            pt: { xs: 10, md: 18 }, 
            pb: { xs: 6, md: 10 }, 
            mb: 0,
            px: { xs: 2, sm: 3 }
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 4, md: 8 }}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* LEFT CONTENT */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  lineHeight: 1.15,
                  mb: { xs: 2, md: 3 },
                  fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3.8rem" },
                  letterSpacing: "-1px",
                  textAlign: { xs: "center", md: "left" }
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
                  mb: { xs: 3, md: 5 },
                  maxWidth: "570px",
                  fontWeight: 400,
                  lineHeight: 1.55,
                  fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" },
                  textAlign: { xs: "center", md: "left" },
                  mx: { xs: "auto", md: 0 }
                }}
              >
                A modern space for developers to share what they're building,
                discover new ideas, and connect with makers around the world.
              </Typography>

              {/* BUTTONS */}
              <Stack 
                direction={{ xs: "column", sm: "row" }} 
                spacing={2}
                sx={{ 
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" }
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  fullWidth={{ xs: true, sm: false }}
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.2, md: 1.4 },
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    textTransform: "none",
                    backgroundColor: "#1976d2",
                    boxShadow: "0 4px 14px rgba(25,118,210,0.3)",
                    maxWidth: { xs: "100%", sm: "none" },
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
                  fullWidth={{ xs: true, sm: false }}
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.2, md: 1.4 },
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    textTransform: "none",
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    maxWidth: { xs: "100%", sm: "none" },
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

            {/* RIGHT IMAGE - Hidden on mobile */}
            <Box
              component="img"
              src="https://img.freepik.com/free-vector/coding-concept-illustration_114360-1678.jpg"
              alt="hero illustration"
              sx={{
                width: { xs: "100%", sm: "90%", md: "480px" },
                maxWidth: "480px",
                borderRadius: 3,
                display: { xs: "none", md: "block" },
                boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
                objectFit: "cover",
              }}
            />
          </Stack>
        </Container>

        {/* FEATURES SECTION */}
        <Box sx={{ bgcolor: "#fff", py: { xs: 6, md: 10 }, mb: 0 }}>
          <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                textAlign: "center",
                mb: { xs: 4, md: 6 },
                letterSpacing: "-0.5px",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.3rem" },
              }}
            >
              Why Join DevShowcase?
            </Typography>

            <Stack spacing={{ xs: 2, md: 4 }} alignItems="center">
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
                    p: { xs: 2, md: 4 },
                    width: "100%",
                    maxWidth: "750px",
                    borderRadius: { xs: 2, md: 4 },
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
                    sx={{ 
                      mb: { xs: 0.75, md: 1.5 }, 
                      color: "#1976d2",
                      fontSize: { xs: "0.95rem", md: "1.25rem" }
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: "0.8rem", md: "1rem" },
                      lineHeight: { xs: 1.5, md: 1.6 }
                    }}
                  >
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
          pt: { xs: 4, md: 6 },
          pb: { xs: 3, md: 4 },
          textAlign: "center",
          borderTop: "3px solid",
          borderImage: "linear-gradient(90deg, #1976d2, #6a11cb) 1",
        }}
      >
        <Typography sx={{ 
          opacity: 0.6, 
          fontSize: { xs: "0.8rem", md: "0.9rem" },
          px: 2
        }}>
          DevShowcase © 2025 — Made with ❤️ by Gaurav
        </Typography>
      </Box>
    </>
  );
}