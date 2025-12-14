import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function ProjectPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  async function loadCurrentUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.log("Failed to load user:", err);
    }
  }

  async function loadProject() {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await axios.get(`${API_URL}/api/projects/${id}`, { headers });
      
      console.log("🔍 Backend Response:", res.data);
      console.log("🔍 Liked value:", res.data.liked, "Type:", typeof res.data.liked);
      console.log("🔍 Likes value:", res.data.likes, "Type:", typeof res.data.likes);
      
      // ⭐ FIX: Ensure proper data types
      const projectData = {
        ...res.data,
        // If liked is 0 or "0", it should be false. If 1 or "1" or true, should be true
        liked: res.data.liked === 1 || res.data.liked === "1" || res.data.liked === true,
        likes: parseInt(res.data.likes) || 0,
      };
      
      console.log("✅ Processed Data:", projectData);
      
      setProject(projectData);
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

    const wasLiked = project.liked;
    const previousLikes = parseInt(project.likes) || 0;

    // ⭐ OPTIMISTIC UPDATE
    setProject({
      ...project,
      liked: !wasLiked,
      likes: wasLiked ? previousLikes - 1 : previousLikes + 1,
    });

    try {
      if (wasLiked) {
        // Unlike
        await axios.delete(`${API_URL}/api/projects/${id}/like`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Like
        await axios.post(
          `${API_URL}/api/projects/${id}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      // ⭐ Reload to get fresh data from backend
      await loadProject();
    } catch (err) {
      console.log("Like failed:", err);
      // ⭐ REVERT ON ERROR
      setProject({
        ...project,
        liked: wasLiked,
        likes: previousLikes,
      });
    }
  }

  async function handleAddComment() {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem("token");

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

      const newComment = {
        ...res.data,
        user_name: currentUser?.name || currentUser?.username || "You",
      };

      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (err) {
      console.log("Failed to add comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  }

  useEffect(() => {
    async function init() {
      await loadCurrentUser();
      await loadProject();
      await loadComments();
      setLoading(false);
    }
    init();
  }, [id]);

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

          {/* ⭐ SIMPLE LIKE ICON BUTTON */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }}>
            <IconButton
              onClick={handleLike}
              sx={{
                color: project.liked ? "#ef4444" : "#94a3b8",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: project.liked ? "#dc2626" : "#ef4444",
                  transform: "scale(1.1)",
                },
              }}
            >
              {project.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>

            <Typography variant="body1" fontWeight={600}>
              {parseInt(project.likes) || 0}
            </Typography>
          </Box>
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
            <Card 
              key={c.id} 
              sx={{ 
                p: 2.5,
                transition: "0.2s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {(c.user_name || "A")[0].toUpperCase()}
                </Box>
                
                <Typography fontWeight={700} color="primary">
                  {c.user_name || "Anonymous User"}
                </Typography>
              </Stack>
              
              <Typography sx={{ mt: 0.5, pl: 6 }}>{c.text}</Typography>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}