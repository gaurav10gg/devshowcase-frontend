import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useThemeMode } from "../context/ThemeContext";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = useTheme();
  const { mode } = useThemeMode();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: theme.palette.background.default,
        color: mode === "dark" ? "#e5e5e5" : "#111",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        sx={{
          // ⭐ MOBILE FIX: hide sidebar by default on small screens
          display: {
            xs: sidebarOpen ? "block" : "none",
            sm: "block",
          },
        }}
      />

      {/* Main area */}
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        
        {/* Topbar */}
        <Topbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            bgcolor: theme.palette.background.default,
            p: { xs: 1.5, sm: 3 }, // ⭐ MOBILE PADDING FIX
            mt: "64px",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
