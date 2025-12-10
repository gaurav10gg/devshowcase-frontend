import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} />

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
            bgcolor: "#f3f4f6",
            p: 3,
            mt: "64px"  // height of topbar
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}