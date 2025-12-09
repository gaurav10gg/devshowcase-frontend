import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Switch,
  Avatar,
  Paper,
} from "@mui/material";
import axios from "axios";
import { supabase } from "../supabaseClient";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    bio: "",
    github: "",
    linkedin: "",
    website: "",
    avatar: "",
  });

  // Fetch user data
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserInfo(res.data);
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/users/me",
        userInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile Updated!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
    setLoading(false);
  };

  // Upload new avatar
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await axios.post(
      "http://localhost:5000/api/upload/avatar",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setUserInfo((prev) => ({ ...prev, avatar: res.data.url }));
  };

  return (
    <Box maxWidth="700px" mx="auto" mt={1}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Settings
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Profile
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center" mb={3}>
          <Avatar
            src={userInfo.avatar}
            sx={{ width: 80, height: 80 }}
          />
          <Button variant="outlined" component="label">
            Change Avatar
            <input hidden type="file" accept="image/*" onChange={handleAvatarUpload} />
          </Button>
        </Stack>

        <TextField
          fullWidth
          label="Username"
          value={userInfo.username}
          onChange={(e) =>
            setUserInfo({ ...userInfo, username: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <TextField
          multiline
          rows={3}
          fullWidth
          label="Bio"
          value={userInfo.bio}
          onChange={(e) =>
            setUserInfo({ ...userInfo, bio: e.target.value })
          }
          sx={{ mb: 2 }}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Social Links
        </Typography>

        <TextField
          label="GitHub"
          fullWidth
          sx={{ mb: 2 }}
          value={userInfo.github}
          onChange={(e) => setUserInfo({ ...userInfo, github: e.target.value })}
        />

        <TextField
          label="LinkedIn"
          fullWidth
          sx={{ mb: 2 }}
          value={userInfo.linkedin}
          onChange={(e) =>
            setUserInfo({ ...userInfo, linkedin: e.target.value })
          }
        />

        <TextField
          label="Website / Portfolio"
          fullWidth
          value={userInfo.website}
          onChange={(e) =>
            setUserInfo({ ...userInfo, website: e.target.value })
          }
        />
      </Paper>

      {/* Preferences */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Preferences
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>Dark Mode</Typography>
          <Switch />
        </Stack>
      </Paper>

      {/* Save Button */}
      <Button
        variant="contained"
        size="large"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      {/* Danger Zone */}
      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" color="error" mb={1}>
        Danger Zone
      </Typography>

      <Button variant="outlined" color="error">
        Delete My Account
      </Button>
    </Box>
  );
}
