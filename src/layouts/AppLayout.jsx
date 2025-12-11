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

  const SIDEBAR_WIDTH = sidebarOpen ? 200 : 64;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: mode === "dark" ? "#e5e5e5" : "#111",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` } }}>
        
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
            p: { xs: 1.5, sm: 3 },
            mt: "64px",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
