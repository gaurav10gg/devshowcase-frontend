import { Box, IconButton, Typography, Avatar, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function Topbar({ sidebarOpen, onToggleSidebar }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ⭐ Fetch logged-in user (with avatar)
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/users/me", {
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
      sx={{
        height: 64,
        bgcolor: "white",
        borderBottom: "1px solid #e5e7eb",
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
      }}
    >
      {/* Left side */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={onToggleSidebar}>
          <MenuIcon />
        </IconButton>

        <Typography sx={{ fontWeight: 600, ml: 2 }}>
          Dev Showcase
        </Typography>
      </Box>

      {/* Right Side (Avatar + Logout) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        
        {/* ⭐ Avatar now uses uploaded image */}
        <Avatar 
          src={user?.avatar || null}
          sx={{ width: 34, height: 34 }}
        >
          {!user?.avatar && user?.name ? user.name[0] : "U"}
        </Avatar>

        <Button
          variant="outlined"
          size="small"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
