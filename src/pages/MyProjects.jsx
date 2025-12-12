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
  Chip,
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
  // SAVE PROJECT
  // ------------------------
  const saveProject = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in again.");
      return;
    }

    const payload = {
      ...form,
      tags: (form.tags || "")
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
      console.error(err);
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
      console.error(err);
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

  // IMAGE UPLOAD
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
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={700}>
          My Projects
        </Typography>
        <Button
          variant="contained"
          size="large"
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
          + New Project
        </Button>
      </Box>

      {/* LOADING */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={3} mt={4}>
          {data?.map((project) => (
            <Card
              key={project.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "stretch",
                p: 2,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              {/* LEFT CONTENT */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <CardMedia
                  component="img"
                  src={project.image}
                  alt={project.title}
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {project.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.8, mt: 0.5, mb: 1 }}
                  >
                    {project.short_desc}
                  </Typography>

                  {/* TAGS */}
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {project.tags?.map((tag, i) => (
                      <Chip
                        label={tag}
                        key={i}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Box>

              {/* BUTTONS */}
              <Stack spacing={1} direction="row" alignSelf="center">
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

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: { xs: "90vw", sm: 500 },
            maxHeight: "90vh",
            overflowY: "auto",
            p: 4,
            bgcolor: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: 24,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={2}>
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
              <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
            </Button>

            {form.image && (
              <img
                src={form.image}
                alt="preview"
                style={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "10px",
                  objectFit: "cover",
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
              fullWidth
            />

            <Button variant="contained" size="large" onClick={saveProject}>
              {editingId ? "Save Changes" : "Create Project"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
