import { Box, Typography, Stack, Paper } from "@mui/material";

export default function About() {
  return (
    <Box maxWidth="900px" mx="auto" mt={2} pb={5}>
      {/* PAGE HEADER */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          letterSpacing: "-0.03em",
          mb: 2,
        }}
      >
        About Dev Showcase
      </Typography>

      <Typography variant="body1" sx={{ color: "#64748b", mb: 4, lineHeight: 1.6 }}>
        Dev Showcase is a community-driven platform where developers can share
        the projects they build, get real feedback, explore ideas, and grow
        their identity as creators.
      </Typography>

      {/* FEATURE SECTIONS */}
      <Stack spacing={3}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "white",
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            🚀 Share Your Work
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
            Whether you're building web apps, AI tools, game engines, or small creative
            experiments — Dev Showcase lets you publish your projects and present them
            beautifully to the world.
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "white",
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            💬 Get Feedback & Support
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
            Developers from across the community can like your projects, give feedback,
            comment on ideas, and help you improve. Collaboration fuels innovation.
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "white",
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            🌱 Grow as a Developer
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
            Build your developer identity by showcasing your best work. The more
            you create, the more you learn, and the more visibility you gain.
            Dev Showcase is your personal launchpad.
          </Typography>
        </Paper>
      </Stack>

      {/* FOOTER TEXT */}
      <Typography
        variant="body2"
        sx={{
          mt: 5,
          textAlign: "center",
          color: "#94a3b8",
        }}
      >
        Made with ❤️ by Gaurav. Always keep building.
      </Typography>
    </Box>
  );
}
