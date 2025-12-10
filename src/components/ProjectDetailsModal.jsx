import {
  Modal,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { useThemeMode } from "../context/ThemeContext"; // ⭐ Add dark mode hook

export default function ProjectDetailsModal({ open, onClose, project }) {
  const { mode } = useThemeMode(); // ⭐ detect theme

  if (!project) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "600px",

          /* ⭐ LIGHT vs DARK BG */
          bgcolor: mode === "light" ? "#ffffff" : "#161b22",

          borderRadius: 3,
          p: 3,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "85vh",
          overflowY: "auto",

          /* ⭐ BORDER in dark mode */
          border:
            mode === "light"
              ? "1px solid #e5e7eb"
              : "1px solid #30363d",

          color: mode === "light" ? "#111" : "#f0f6fc",
        }}
      >
        {/* IMAGE */}
        <img
          src={project.image}
          alt={project.title}
          style={{
            width: "100%",
            height: "250px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />

        {/* TITLE */}
        <Typography
          variant="h5"
          fontWeight={700}
          mt={2}
          sx={{ color: mode === "light" ? "#111" : "#f0f6fc" }}
        >
          {project.title}
        </Typography>

        {/* SHORT DESC */}
        <Typography
          variant="body1"
          sx={{
            color: mode === "light" ? "#64748b" : "#8b949e",
            mt: 1,
          }}
        >
          {project.short_desc}
        </Typography>

        {/* FULL DESC */}
        <Typography
          variant="body2"
          sx={{
            color: mode === "light" ? "#475569" : "#c9d1d9",
            mt: 2,
            lineHeight: 1.6,
          }}
        >
          {project.full_desc}
        </Typography>

        {/* LINKS */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          {project.github && (
            <Button
              variant="outlined"
              component="a"
              href={project.github}
              target="_blank"
              sx={{
                borderColor:
                  mode === "light" ? "#d1d5db" : "#30363d",
                color: mode === "light" ? "#111" : "#f0f6fc",
                "&:hover": {
                  borderColor:
                    mode === "light" ? "#111" : "#8b949e",
                  background:
                    mode === "light" ? "#f9fafb" : "#1b1f24",
                },
              }}
            >
              GitHub
            </Button>
          )}

          {project.live && (
            <Button
              variant="contained"
              component="a"
              href={project.live}
              target="_blank"
              sx={{
                bgcolor:
                  mode === "light" ? "#2563eb" : "#238636",
                "&:hover": {
                  bgcolor:
                    mode === "light" ? "#1d4ed8" : "#2ea043",
                },
              }}
            >
              Live Demo
            </Button>
          )}
        </Stack>

        {/* FOOTER INFO */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 3,
            color: mode === "light" ? "#94a3b8" : "#8b949e",
          }}
        >
          Likes: {project.likes} | Comments:{" "}
          {project.comments_count ?? 0}
        </Typography>
      </Box>
    </Modal>
  );
}

