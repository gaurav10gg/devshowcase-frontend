import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { likeProject, unlikeProject } from "../api/projects";
import axios from "axios";
import { API_URL } from "../config";

import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Stack,
  Skeleton,
  Chip,
} from "@mui/material";

export default function ProjectPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  async function loadProject() {
    try {
      const token = localStorage.getItem("token");
      
      // ⭐ Send token to get liked status
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await axios.get(`${API_URL}/api/projects/${id}`, { headers });
      setProject(res.data);
    } catch (err) {
      console.log("Failed to load project:", err);
    }
  }

  async function loadComments() {
    try {
      const res = await axios.get(`${API_URL}/api/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.log("Failed to load comments:", err);
    }
  }

  async function handleLike() {
    if (!project) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to like projects");
      return;
    }

    // ⭐ Optimistic update
    const prev = { ...project };

    const updated = {
      ...project,
      liked: !project.liked,
      likes: project.liked ? project.likes - 1 : project.likes + 1,
    };

    setProject(updated);

    try {
      const result = project.liked
        ? await unlikeProject(project.id)
        : await likeProject(project.id);

      // ⭐ Sync with backend
      setProject((p) => ({
        ...p,
        liked: result.liked,
        likes: Number(result.likes),
      }));
    } catch (err) {
      console.log("Like failed:", err);
      setProject(prev); // revert
    }
  }

  async function handleAddComment() {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem("token"); // ✅ FIXED

      if (!token) {
        alert("Please log in to comment");
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/comments/${id}`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // append new comment instantly
      setComments((prev) => [...prev, res.data]);
      setCommentText("");
    } catch (err) {
      console.log("Failed to add comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  }

  useEffect(() => {
    async function init() {
      await loadProject();
      await loadComments();
      setLoading(false);
    }
    init();
  }, [id]);

  /* ================================
     ⭐ LOADING SKELETON UI
  ================================ */
  if (loading) {
    return (
      <Box maxWidth="900px" mx="auto" p={3}>
        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <Skeleton variant="rectangular" height={340} />

          <CardContent>
            <Skeleton width="60%" height={40} />
            <Skeleton width="80%" height={20} />
            <Skeleton width="90%" height={20} />
            <Skeleton width="95%" height={20} sx={{ mb: 2 }} />

            <Stack direction="row" spacing={2} mt={3}>
              <Skeleton variant="rectangular" width={120} height={40} />
              <Skeleton variant="rectangular" width={120} height={40} />
            </Stack>

            <Skeleton variant="rectangular" width={140} height={45} sx={{ mt: 3 }} />
          </CardContent>
        </Card>

        <Typography variant="h5" mb={2}>
          <Skeleton width={150} />
        </Typography>

        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={70} />
          <Skeleton variant="rectangular" height={70} />
        </Stack>
      </Box>
    );
  }

  if (!project) return <Box p={4}>Project not found.</Box>;

  return (
    <Box maxWidth="900px" mx="auto" p={3}>
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardMedia
          component="img"
          height="340"
          image={project.image}
          alt={project.title}
        />

        <CardContent>
          <Typography variant="h4" fontWeight={700}>
            {project.title}
          </Typography>

          <Typography sx={{ mt: 1 }} color="text.secondary">
            {project.short_desc}
          </Typography>

          <Typography sx={{ mt: 2, lineHeight: 1.6 }}>
            {project.full_desc}
          </Typography>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
              {project.tags.map((tag, i) => (
                <Chip key={i} label={tag} size="small" color="primary" variant="outlined" />
              ))}
            </Stack>
          )}

          {/* Buttons */}
          <Stack direction="row" spacing={2} mt={3}>
            {project.github && (
              <Button variant="outlined" href={project.github} target="_blank">
                GitHub
              </Button>
            )}

            {project.live && (
              <Button variant="contained" href={project.live} target="_blank">
                Live Demo
              </Button>
            )}
          </Stack>

          {/* ⭐ IMPROVED LIKE BUTTON */}
          <Button
            onClick={handleLike}
            variant={project.liked ? "contained" : "outlined"}
            sx={{
              mt: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2.5,
              py: 1,
              borderRadius: "12px",
              fontWeight: 600,
              textTransform: "none",
              borderColor: project.liked ? "#ef4444" : "#d1d5db",
              bgcolor: project.liked ? "#ef4444" : "transparent",
              color: project.liked ? "#fff" : "#64748b",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: project.liked ? "#dc2626" : "#f8fafc",
                borderColor: project.liked ? "#dc2626" : "#94a3b8",
                transform: "scale(1.02)",
              },
            }}
          >
            <span style={{ fontSize: "18px" }}>
              {project.liked ? "❤️" : "🤍"}
            </span>

            <span>
              {project.likes} {project.likes === 1 ? "Like" : "Likes"}
            </span>
          </Button>

        </CardContent>
      </Card>

      {/* Comments Section */}
      <Box mt={4}>
        <Typography variant="h5" mb={2} fontWeight={700}>
          Comments ({comments.length})
        </Typography>

        <Stack direction="row" spacing={2} mb={3}>
          <TextField
            fullWidth
            label="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />

          <Button 
            variant="contained" 
            onClick={handleAddComment}
            disabled={!commentText.trim()}
          >
            Post
          </Button>
        </Stack>

        <Stack spacing={2}>
          {comments.length === 0 && (
            <Typography color="text.secondary" textAlign="center" py={3}>
              No comments yet. Be the first to comment!
            </Typography>
          )}

          {comments.map((c) => (
            <Card key={c.id} sx={{ p: 2 }}>
              <Typography fontWeight={600} color="primary">
                {c.user_name || "Anonymous User"}
              </Typography>
              <Typography sx={{ mt: 0.5 }}>{c.text}</Typography>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}