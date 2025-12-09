import { useState } from "react";
import { Box, Typography, Chip, Stack, Skeleton } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";
import CommentsModal from "../components/CommentsModal"; // 🆕 IMPORT
import ProjectDetailsModal from "../components/ProjectDetailsModal";

export default function Home() {
  const qc = useQueryClient();
  const token = localStorage.getItem("token");

  // ----------------------------------------
  // FETCH ALL PROJECTS
  // ----------------------------------------
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: token ? { Authorization: "Bearer " + token } : undefined,
      });
      return res.data;
    },
  });

  // ----------------------------------------
  // LIKE / UNLIKE TOGGLE MUTATION
  // ----------------------------------------
  const likeMutation = useMutation({
    mutationFn: async ({ id, liked }) => {
      const t = localStorage.getItem("token");

      if (liked) {
        // ⭐ UNLIKE
        const res = await axios.delete(
          `http://localhost:5000/api/projects/${id}/like`,
          { headers: { Authorization: "Bearer " + t } }
        );
        return res.data;
      } else {
        // ⭐ LIKE
        const res = await axios.post(
          `http://localhost:5000/api/projects/${id}/like`,
          {},
          { headers: { Authorization: "Bearer " + t } }
        );
        return res.data;
      }
    },

    // ⭐ OPTIMISTIC UPDATE
    onMutate: async ({ id, liked }) => {
      await qc.cancelQueries(["projects"]);

      const previous = qc.getQueryData(["projects"]);

      qc.setQueryData(["projects"], (old) =>
        old.map((p) =>
          p.id === id
            ? {
                ...p,
                liked: !liked,
                likes: liked ? p.likes - 1 : p.likes + 1,
              }
            : p
        )
      );

      return { previous };
    },

    // rollback if fails
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(["projects"], ctx.previous);
    },

    // refetch from backend for correctness
    onSettled: () => {
      qc.invalidateQueries(["projects"]);
    },
  });

  // Handle like click
  const handleLike = (project) => {
    if (!token) return alert("Please sign in to like projects.");

    likeMutation.mutate({
      id: project.id,
      liked: project.liked,
    });
  };

  // ----------------------------------------
  // COMMENTS MODAL STATE
  // ----------------------------------------
  const [openComments, setOpenComments] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const openCommentsModal = (project) => {
    setSelectedProject(project);
    setOpenComments(true);
  };

  // ----------------------------------------
// PROJECT DETAILS MODAL STATE
// ----------------------------------------
const [openDetails, setOpenDetails] = useState(false);
const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);

const openProjectModal = (project) => {
  setSelectedProjectDetails(project);
  setOpenDetails(true);
};


  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  if (error) {
    return (
      <Typography sx={{ color: "red", mt: 4, textAlign: "center" }}>
        Failed to load projects.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        mt: 2,
        pb: 5,
      }}
    >
      {/* -------- HEADER -------- */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{
            textTransform: "uppercase",
            color: "#94a3b8",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          Home
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.03em",
            mt: 0.5,
            mb: 0.5,
          }}
        >
          Discover Projects
        </Typography>

        <Typography variant="body2" sx={{ color: "#64748b" }}>
          See what other developers are building right now.
        </Typography>
      </Box>

      {/* -------- FILTER CHIPS -------- */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 3 }} flexWrap="wrap">
        <Chip
          label="Top this week"
          color="primary"
          sx={{
            borderRadius: 999,
            fontSize: 13,
            bgcolor: "#2563eb",
            color: "white",
            px: 1.5,
          }}
        />
        <Chip label="Newest" variant="outlined" sx={{ borderRadius: 999 }} />
        <Chip label="Web Apps" variant="outlined" sx={{ borderRadius: 999 }} />
        <Chip label="AI Tools" variant="outlined" sx={{ borderRadius: 999 }} />
      </Stack>

      {/* -------- FEED AREA -------- */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: 3,
        }}
      >
        {/* Skeleton Loading */}
        {isLoading &&
          [1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              sx={{
                p: 2,
                bgcolor: "white",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
              }}
            >
              <Skeleton variant="rectangular" height={150} sx={{ mb: 2 }} />
              <Skeleton width="40%" />
              <Skeleton width="60%" />
              <Skeleton width="30%" />
            </Box>
          ))}

        {/* Project Feed */}
        {!isLoading &&
          data &&
          data.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              short_desc={project.short_desc}
              image={project.image}
              likes={project.likes}
              comments={project.comments_count ?? 0}
              liked={project.liked}
              onLike={() => handleLike(project)}
              onClick={() => openProjectModal(project)}
              onCommentsClick={() => openCommentsModal(project)}
            />
          ))}
      </Box>

      {/* EMPTY STATE */}
      {!isLoading && data?.length === 0 && (
        <Typography
          sx={{
            textAlign: "center",
            mt: 5,
            color: "#94a3b8",
            fontSize: 16,
          }}
        >
          No projects found. Be the first to post!
        </Typography>
      )}

      {/* COMMENTS MODAL */}
      <CommentsModal
        open={openComments}
        onClose={() => setOpenComments(false)}
        project={selectedProject}
      />
      <ProjectDetailsModal
  open={openDetails}
  onClose={() => setOpenDetails(false)}
  project={selectedProjectDetails}
/>

    </Box>
  );
}
