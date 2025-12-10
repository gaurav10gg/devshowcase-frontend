import {
  Box,
  Typography,
  Stack,
  Button,
  Modal,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";   // ⭐ REQUIRED FOR DARK MODE
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../config";

export default function MyProjects() {
  const theme = useTheme(); // ⭐ MUI theme (light/dark)
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    short_desc: "",
    full_desc: "",
    image: "",
    github: "",
    live: "",
    tags: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myProjects"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/projects/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const createProject = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${API_URL}/api/projects`,
        {
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOpen(false);
      refetch();
      setForm({
        title: "",
        short_desc: "",
        full_desc: "",
        image: "",
        github: "",
        live: "",
        tags: "",
      });
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setForm((prev) => ({ ...prev, image: res.data.url }));
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">My Projects</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New Project
        </Button>
      </Box>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={2} mt={3}>
          {data?.map((project) => (
            <Card
              key={project.id}
              sx={{
                display: "flex",
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            >
              <CardMedia
                component="img"
                image={project.image}
                alt={project.title}
                sx={{ width: 160, height: 160, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6">{project.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.short_desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 500,
            p: 4,
            bgcolor: theme.palette.background.paper, // ⭐ DARK MODE FIX
            color: theme.palette.text.primary, // ⭐ DARK MODE FIX
            borderRadius: 2,
            boxShadow: 24,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h5" mb={2}>
            Create New Project
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
              InputLabelProps={{ style: { color: theme.palette.text.primary } }}
            />

            <Button variant="outlined" component="label">
              Upload Image
              <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
            </Button>

            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            )}

            <TextField
              label="Short Description"
              value={form.short_desc}
              onChange={(e) =>
                setForm({ ...form, short_desc: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Full Description"
              multiline
              rows={3}
              value={form.full_desc}
              onChange={(e) =>
                setForm({ ...form, full_desc: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="GitHub Link"
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
              fullWidth
            />

            <TextField
              label="Live Link"
              value={form.live}
              onChange={(e) => setForm({ ...form, live: e.target.value })}
              fullWidth
            />

            <TextField
              label="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              helperText="Example: ai, blockchain, webapp"
              fullWidth
            />

            <Button variant="contained" onClick={createProject}>
              Create
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
