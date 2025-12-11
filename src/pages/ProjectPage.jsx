import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById, likeProject, unlikeProject } from "../api/projects";
import { getAuthHeaders } from "../api/index";
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
  Skeleton,   // ⭐ ADDED
} from "@mui/material";

export default function ProjectPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  async function loadProject() {
    try {
      const data = await fetchProjectById(id);
      setProject(data);
    } catch (err) {
      console.log("Failed to load project:", err);
    }
  }

  async function loadComments() {
    try {
      const res = await axios.get(`${API_URL}/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.log("Failed to load comments:", err);
    }
  }
async function handleLike() {
  if (!project) return;

  // ⭐ OPTIMISTIC UI UPDATE
  const prev = { ...project };

  const newState = {
    ...project,
    liked: !project.liked,
    likes: project.liked ? project.likes - 1 : project.likes + 1,
  };

  setProject(newState);

  try {
    const result = project.liked
      ? await unlikeProject(project.id)
      : await likeProject(project.id);

    // ⭐ BACKEND CONFIRMS → update with real values
    setProject({
      ...project,
      likes: result.likes,
      liked: result.liked,
    });
  } catch (err) {
    console.log("Like failed:", err);
    // ❗ Revert if backend failed
    setProject(prev);
  }
}

  async function handleAddComment() {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/comments/${id}`,
        { text: commentText },
        { headers: getAuthHeaders() }
      );

      setComments([...comments, res.data]);
      setCommentText("");
    } catch (err) {
      console.log("Failed to add comment:", err);
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

          <Button
            onClick={handleLike}
            variant="contained"
            sx={{ mt: 3 }}
            color={project.liked ? "error" : "primary"}
          >
            {project.liked ? "❤️ Liked" : "🤍 Like"} {project.likes}
          </Button>
        </CardContent>
      </Card>

      {/* Comments */}
      <Box mt={4}>
        <Typography variant="h5" mb={2}>
          Comments
        </Typography>

        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            fullWidth
            label="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <Button variant="contained" onClick={handleAddComment}>
            Post
          </Button>
        </Stack>

        <Stack spacing={2}>
          {comments.map((c) => (
            <Card key={c.id} sx={{ p: 2 }}>
              <Typography fontWeight={600}>{c.user_name || "User"}</Typography>
              <Typography>{c.text}</Typography>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

