import { useState } from "react";
import { Box, Typography, Chip, Stack, Skeleton } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";
import CommentsModal from "../components/CommentsModal";
import ProjectDetailsModal from "../components/ProjectDetailsModal";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../context/ThemeContext";

export default function Home() {
  const qc = useQueryClient();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { mode } = useThemeMode();

  // ----------------------------------------
  // FETCH ALL PROJECTS
  // ----------------------------------------
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/projects`, {
        headers: token ? { Authorization: "Bearer " + token } : undefined,
      });
      
      // ⭐ If backend doesn't return 'liked', use localStorage
      const likedProjects = JSON.parse(localStorage.getItem("likedProjects") || "[]");
      
      return res.data.map(project => ({
        ...project,
        liked: project.liked !== undefined 
          ? (project.liked === 1 || project.liked === "1" || project.liked === true)
          : likedProjects.includes(project.id),
        likes: parseInt(project.likes) || 0,
      }));
    },
  });

  // ----------------------------------------
  // LIKE / UNLIKE TOGGLE MUTATION
  // ----------------------------------------
  const likeMutation = useMutation({
    mutationFn: async ({ id, liked }) => {
      const t = localStorage.getItem("token");

      if (liked) {
        // Unlike
        await axios.delete(`${API_URL}/api/projects/${id}/like`, {
          headers: { Authorization: "Bearer " + t },
        });
        
        // ⭐ Update localStorage
        const likedProjects = JSON.parse(localStorage.getItem("likedProjects") || "[]");
        const updated = likedProjects.filter(pid => pid !== id);
        localStorage.setItem("likedProjects", JSON.stringify(updated));
      } else {
        // Like
        await axios.post(
          `${API_URL}/api/projects/${id}/like`,
          {},
          { headers: { Authorization: "Bearer " + t } }
        );
        
        // ⭐ Update localStorage
        const likedProjects = JSON.parse(localStorage.getItem("likedProjects") || "[]");
        if (!likedProjects.includes(id)) {
          likedProjects.push(id);
          localStorage.setItem("likedProjects", JSON.stringify(likedProjects));
        }
      }
    },

    onMutate: async ({ id, liked }) => {
      await qc.cancelQueries(["projects"]);
      const previous = qc.getQueryData(["projects"]);

      // ⭐ OPTIMISTIC UPDATE - CLEAN LOGIC
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

    onError: (_err, _vars, ctx) => {
      // ⭐ REVERT ON ERROR
      qc.setQueryData(["projects"], ctx.previous);
    },

    onSettled: () => {
      // ⭐ REMOVED invalidateQueries to prevent double counting
    },
  });

  const handleLike = (project) => {
    if (!token) return alert("Please sign in to like projects.");
    likeMutation.mutate({ id: project.id, liked: project.liked });
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

  if (error) {
    return (
      <Typography sx={{ color: mode === "dark" ? "#f87171" : "red", mt: 4, textAlign: "center" }}>
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
        color: mode === "dark" ? "#e5e5e5" : "#111",
      }}
    >
      {/* -------- HEADER -------- */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{
            textTransform: "uppercase",
            color: mode === "dark" ? "#9ca3af" : "#94a3b8",
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
            color: mode === "dark" ? "#fff" : "#000",
          }}
        >
          Discover Projects
        </Typography>

        <Typography variant="body2" sx={{ color: mode === "dark" ? "#b3b3b3" : "#64748b" }}>
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
            px: 1.5,
          }}
        />
        <Chip
          label="Newest"
          variant="outlined"
          sx={{
            borderRadius: 999,
            color: mode === "dark" ? "#e5e5e5" : "inherit",
            borderColor: mode === "dark" ? "#4b5563" : "inherit",
          }}
        />
        <Chip
          label="Web Apps"
          variant="outlined"
          sx={{
            borderRadius: 999,
            color: mode === "dark" ? "#e5e5e5" : "inherit",
            borderColor: mode === "dark" ? "#4b5563" : "inherit",
          }}
        />
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
                bgcolor: mode === "dark" ? "#181818" : "white",
                borderRadius: 2,
                border: `1px solid ${mode === "dark" ? "#27272a" : "#e2e8f0"}`,
              }}
            >
              <Skeleton
                variant="rectangular"
                height={150}
                sx={{ mb: 2, bgcolor: mode === "dark" ? "#3f3f46" : undefined }}
              />
              <Skeleton sx={{ bgcolor: mode === "dark" ? "#3f3f46" : undefined }} width="40%" />
              <Skeleton sx={{ bgcolor: mode === "dark" ? "#3f3f46" : undefined }} width="60%" />
              <Skeleton sx={{ bgcolor: mode === "dark" ? "#3f3f46" : undefined }} width="30%" />
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
              onClick={() => navigate(`/project/${project.id}`)}
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
            color: mode === "dark" ? "#9ca3af" : "#94a3b8",
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