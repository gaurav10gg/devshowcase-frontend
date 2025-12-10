import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../config";
import { useThemeMode } from "../context/ThemeContext"; // ⭐ added for dark mode

export default function CommentsModal({ open, onClose, project }) {
  const qc = useQueryClient();
  const token = localStorage.getItem("token");
  const { mode } = useThemeMode(); // ⭐ detect light/dark

  // ----------------------------------------
  // FETCH COMMENTS
  // ----------------------------------------
  const { data: comments } = useQuery({
    enabled: !!project,
    queryKey: ["comments", project?.id],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/comments/${project.id}`);
      return res.data;
    },
  });

  // ----------------------------------------
  // ADD COMMENT
  // ----------------------------------------
  const [text, setText] = useState("");

  const addComment = useMutation({
    mutationFn: async () => {
      return axios.post(
        `${API_URL}/api/comments/${project.id}`,
        { text },
        { headers: { Authorization: "Bearer " + token } }
      );
    },
    onSuccess: () => {
      setText("");
      qc.invalidateQueries(["comments", project.id]);
    },
  });

  if (!project) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          p: 3,
          mx: "auto",
          mt: "10%",
          borderRadius: 2,

          /* ⭐ TRUE GITHUB DARK */
          bgcolor: mode === "light" ? "#ffffff" : "#161b22",
          color: mode === "light" ? "#111" : "#f0f6fc",

          border:
            mode === "light"
              ? "1px solid #e5e7eb"
              : "1px solid #30363d",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: mode === "light" ? "#111" : "#f0f6fc",
          }}
        >
          Comments for: {project.title}
        </Typography>

        {/* COMMENTS LIST */}
        <Stack
          spacing={2}
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            mb: 2,
            pr: 1,
          }}
        >
          {comments?.length === 0 && (
            <Typography sx={{ color: mode === "light" ? "#94a3b8" : "#8b949e" }}>
              No comments yet.
            </Typography>
          )}

          {comments?.map((c) => (
            <Box
              key={c.id}
              sx={{
                p: 1.5,
                borderRadius: 2,

                /* ⭐ Comment bubble background */
                bgcolor: mode === "light" ? "#f8fafc" : "#1b1f24",

                border:
                  mode === "light"
                    ? "1px solid #e5e7eb"
                    : "1px solid #30363d",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  color: mode === "light" ? "#111" : "#f0f6fc",
                }}
              >
                {c.user_name}
              </Typography>

              <Typography
                sx={{
                  color: mode === "light" ? "#111" : "#c9d1d9",
                }}
              >
                {c.text}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* ADD COMMENT */}
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{
              /* ⭐ Dark mode textfield */
              "& .MuiInputBase-root": {
                bgcolor: mode === "light" ? "#ffffff" : "#0d1117",
                color: mode === "light" ? "#111" : "#f0f6fc",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: mode === "light" ? "#d1d5db" : "#30363d",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: mode === "light" ? "#111" : "#8b949e",
              },
            }}
          />

          <Button
            variant="contained"
            onClick={() => {
              if (!token) return alert("Please login to comment");
              if (text.trim().length === 0) return;

              addComment.mutate();
            }}
            sx={{
              bgcolor: mode === "light" ? "#2563eb" : "#238636",
              "&:hover": {
                bgcolor: mode === "light" ? "#1d4ed8" : "#2ea043",
              },
            }}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}