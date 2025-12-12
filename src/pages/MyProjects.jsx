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
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../config";

export default function MyProjects() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  // ------------------------
  // CREATE / UPDATE project
  // ------------------------
  const saveProject = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    try {
      if (editingId) {
        await axios.patch(`${API_URL}/api/projects/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/api/projects`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setOpen(false);
      setEditingId(null);

      setForm({
        title: "",
        short_desc: "",
        full_desc: "",
        image: "",
        github: "",
        live: "",
        tags: "",
      });

      refetch();
    } catch (err) {
      console.error("Save project error:", err);
      alert("Failed to save project");
    }
  };

  // ------------------------
  // DELETE PROJECT
  // ------------------------
  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      refetch();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  // ------------------------
  // EDIT PROJECT
  // ------------------------
  const startEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      short_desc: project.short_desc,
      full_desc: project.full_desc,
      image: project.image,
      github: project.github,
      live: project.live,
      tags: project.tags?.join(", ") || "",
    });
    setOpen(true);
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
        <Button
          variant="contained"
          onClick={() => {
            setEditingId(null);
            setForm({
              title: "",
              short_desc: "",
              full_desc: "",
              image: "",
              github: "",
              live: "",
              tags: "",
            });
            setOpen(true);
          }}
        >
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
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                p: 2,
              }}
            >
              <Box sx={{ display: "flex" }}>
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
              </Box>

              <Stack spacing={1} direction="row">
                <Button variant="outlined" onClick={() => startEdit(project)}>
                  Edit
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </Button>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      {/* ⭐ FIXED MODAL (ONLY THIS PART CHANGED) */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: { xs: "90%", sm: 500 },
            maxHeight: "90vh",          // ⭐ prevents overflow
            overflowY: "auto",          // ⭐ scroll inside modal
            p: 4,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: 2,
            boxShadow: 24,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h5" mb={2}>
            {editingId ? "Edit Project" : "Create New Project"}
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
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
              onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
              fullWidth
            />

            <TextField
              label="Full Description"
              multiline
              rows={3}
              value={form.full_desc}
              onChange={(e) => setForm({ ...form, full_desc: e.target.value })}
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
              helperText="Example: ai, fullstack, webapp"
              fullWidth
            />

            <Button variant="contained" onClick={saveProject}>
              {editingId ? "Save Changes" : "Create"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
