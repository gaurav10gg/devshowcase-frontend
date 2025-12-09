import {
  Modal,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";

export default function ProjectDetailsModal({ open, onClose, project }) {
  if (!project) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "600px",
          bgcolor: "white",
          borderRadius: 3,
          p: 3,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "85vh",
          overflowY: "auto",
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
        <Typography variant="h5" fontWeight={700} mt={2}>
          {project.title}
        </Typography>

        {/* SHORT DESC */}
        <Typography variant="body1" sx={{ color: "#64748b", mt: 1 }}>
          {project.short_desc}
        </Typography>

        {/* FULL DESC */}
        <Typography variant="body2" sx={{ color: "#475569", mt: 2, lineHeight: 1.6 }}>
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
            >
              Live Demo
            </Button>
          )}
        </Stack>

        {/* FOOTER INFO */}
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 3, color: "#94a3b8" }}
        >
          Likes: {project.likes} | Comments: {project.comments_count ?? 0}
        </Typography>
      </Box>
    </Modal>
  );
}
