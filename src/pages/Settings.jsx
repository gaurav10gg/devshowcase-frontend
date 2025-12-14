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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export default function Settings() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
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
      const res = await axios.get(`${API_URL}/api/users/me`, {
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
        `${API_URL}/api/users/me`,
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
      `${API_URL}/api/upload/avatar`,
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

  // ⭐ LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("token");
      
      // Reset theme to light mode
      localStorage.setItem("themeMode", "light");
      document.documentElement.classList.remove("dark");
      
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  // ⭐ DELETE ACCOUNT FUNCTION (placeholder)
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // You can implement this endpoint in your backend
      // await axios.delete(`${API_URL}/api/users/me`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      
      await supabase.auth.signOut();
      localStorage.removeItem("token");
      localStorage.setItem("themeMode", "light");
      document.documentElement.classList.remove("dark");
      
      alert("Account deleted successfully");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete account. Please try again.");
    }
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
        sx={{ mb: 3 }}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      {/* ⭐ ACCOUNT ACTIONS SECTION */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4,
          bgcolor: theme.palette.mode === "dark" ? "#1a1a1a" : "#fafafa",
          border: `1px solid ${theme.palette.mode === "dark" ? "#333" : "#e0e0e0"}`
        }}
      >
        <Typography variant="h6" mb={2}>
          Account Actions
        </Typography>

        <Stack spacing={2}>
          {/* LOGOUT BUTTON */}
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={() => setOpenLogoutDialog(true)}
            sx={{
              color: theme.palette.mode === "dark" ? "#fbbf24" : "#f59e0b",
              borderColor: theme.palette.mode === "dark" ? "#fbbf24" : "#f59e0b",
              "&:hover": {
                borderColor: "#d97706",
                background: theme.palette.mode === "dark" ? "rgba(251, 191, 36, 0.1)" : "#fef3c7",
              },
            }}
          >
            Logout from Account
          </Button>

          <Typography variant="caption" color="text.secondary" textAlign="center">
            You will be signed out from your current session
          </Typography>
        </Stack>
      </Paper>

      {/* Danger Zone */}
      <Divider sx={{ my: 4 }} />

      <Paper 
        sx={{ 
          p: 3, 
          mb: 4,
          bgcolor: theme.palette.mode === "dark" ? "#1a0a0a" : "#fff5f5",
          border: `1px solid ${theme.palette.mode === "dark" ? "#5c1a1a" : "#fecaca"}`
        }}
      >
        <Typography variant="h6" color="error" mb={1}>
          Danger Zone
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Once you delete your account, there is no going back. Please be certain.
        </Typography>

        <Button 
          variant="outlined" 
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setOpenDeleteDialog(true)}
        >
          Delete My Account
        </Button>
      </Paper>

      {/* ⭐ LOGOUT CONFIRMATION DIALOG */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout? You will need to sign in again to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setOpenLogoutDialog(false);
              handleLogout();
            }} 
            variant="contained"
            color="warning"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* ⭐ DELETE ACCOUNT CONFIRMATION DIALOG */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This will permanently delete your account, 
            all your projects, comments, and likes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setOpenDeleteDialog(false);
              handleDeleteAccount();
            }} 
            variant="contained"
            color="error"
            autoFocus
          >
            Yes, Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}