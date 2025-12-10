import { Box, IconButton, Typography, Avatar, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../config";

import { useThemeMode } from "../context/ThemeContext";

export default function Topbar({ sidebarOpen, onToggleSidebar }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { mode, toggleTheme } = useThemeMode(); // ⭐ Dark Mode Hook

  // Fetch user
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <Box
      className="topbar"
      sx={{
        height: 64,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: sidebarOpen ? 200 : 64,
        right: 0,
        transition: "left 0.25s ease",
        zIndex: 10,

        /* ⭐ LIGHT MODE COLORS */
        bgcolor: mode === "light" ? "#ffffff" : "#161b22",
        borderBottom: mode === "light"
          ? "1px solid #e5e7eb"
          : "1px solid #30363d",
        color: mode === "light" ? "#111" : "#f0f6fc"
      }}
    >
      {/* Left side */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={onToggleSidebar}
          sx={{
            color: mode === "light" ? "#111" : "#f0f6fc"
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          sx={{
            fontWeight: 600,
            ml: 2,
            color: mode === "light" ? "#111" : "#f0f6fc"
          }}
        >
          Dev Showcase
        </Typography>
      </Box>

      {/* Right Side */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

        {/* ⭐ DARK MODE TOGGLE BUTTON */}
        <IconButton
          onClick={toggleTheme}
          sx={{
            color: mode === "light" ? "#111" : "#f0f6fc"
          }}
        >
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

        {/* Avatar */}
        <Avatar
          src={user?.avatar || null}
          sx={{
            width: 34,
            height: 34,
            bgcolor: mode === "light" ? "#e5e7eb" : "#30363d",
            color: mode === "light" ? "#111" : "#f0f6fc"
          }}
        >
          {!user?.avatar && user?.name ? user.name[0] : "U"}
        </Avatar>

        {/* Logout button */}
        <Button
          variant="outlined"
          size="small"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,

            /* Light mode */
            borderColor: mode === "light" ? "#d1d5db" : "#30363d",
            color: mode === "light" ? "#111" : "#f0f6fc",
            background: mode === "light" ? "#fff" : "#21262d",

            "&:hover": {
              borderColor: mode === "light" ? "#111" : "#8b949e",
              background: mode === "light" ? "#f9fafb" : "#30363d",
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
