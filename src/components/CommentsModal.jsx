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
import { API_URL } from "../config";   // ✅ ADDED THIS


export default function CommentsModal({ open, onClose, project }) {
  const qc = useQueryClient();
  const token = localStorage.getItem("token");

  // ----------------------------------------
  // FETCH COMMENTS FOR THIS PROJECT
  // ----------------------------------------
  const { data: comments } = useQuery({
    enabled: !!project,
    queryKey: ["comments", project?.id],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/api/comments/${project.id}`
      );
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
      qc.invalidateQueries(["comments", project.id]); // refresh comments
    },
  });

  if (!project) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          bgcolor: "white",
          p: 3,
          mx: "auto",
          mt: "10%",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Comments for: {project.title}
        </Typography>

        {/* --------------------------- */}
        {/* EXISTING COMMENTS */}
        {/* --------------------------- */}
        <Stack
          spacing={2}
          sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}
        >
          {comments?.length === 0 && (
            <Typography sx={{ color: "#94a3b8" }}>
              No comments yet.
            </Typography>
          )}

          {comments?.map((c) => (
            <Box
              key={c.id}
              sx={{
                p: 1.5,
                bgcolor: "#f8fafc",
                borderRadius: 2,
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                {c.user_name}
              </Typography>
              <Typography>{c.text}</Typography>
            </Box>
          ))}
        </Stack>

        {/* --------------------------- */}
        {/* ADD COMMENT BOX */}
        {/* --------------------------- */}
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={() => {
              if (!token) return alert("Please login to comment");
              if (text.trim().length === 0) return;

              addComment.mutate();
            }}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
