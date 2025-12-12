import { Box, Typography, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import FolderIcon from "@mui/icons-material/Folder";
import LogoutIcon from "@mui/icons-material/Logout"; // ⭐ added
import { Link, useLocation } from "react-router-dom";
import { useThemeMode } from "../context/ThemeContext";

export default function Sidebar({ open, onClose }) {
  const WIDTH = open ? 200 : 64;
  const location = useLocation();
  const { mode } = useThemeMode();

  const menu = [
    { text: "Home", to: "/home", icon: <HomeIcon /> },
    { text: "My Projects", to: "/my-projects", icon: <FolderIcon /> },
    { text: "Settings", to: "/settings", icon: <SettingsIcon /> },
    { text: "About", to: "/about", icon: <InfoIcon /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      {/* ⭐ Mobile overlay */}
      {open && (
        <Box
          onClick={onClose}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.4)",
            display: { xs: "block", md: "none" },
            zIndex: 8,
          }}
        />
      )}

      <Box
        sx={{
          width: { xs: open ? 200 : 0, md: WIDTH },
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9,
          bgcolor: mode === "light" ? "#ffffff" : "#161b22",
          borderRight:
            mode === "light" ? "1px solid #e5e7eb" : "1px solid #30363d",
          overflow: "hidden",
          transition: "all 0.25s ease",
          display: "flex",
          flexDirection: "column",
          pt: { xs: "72px", md: "16px" },
        }}
      >
        {/* MENU LABEL */}
        {open && (
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: mode === "light" ? "#94a3b8" : "#8b949e",
              px: 2,
              mb: 1.5,
            }}
          >
            MENU
          </Typography>
        )}

        {/* MENU ITEMS */}
        {menu.map((item) => {
          const active = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => onClose?.()}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  cursor: "pointer",
                  bgcolor: active
                    ? mode === "light"
                      ? "#f1f5f9"
                      : "#1b1f24"
                    : "transparent",
                  "&:hover": {
                    bgcolor: mode === "light" ? "#f8fafc" : "#1f2933",
                  },
                  borderRight: active
                    ? mode === "light"
                      ? "3px solid #2563eb"
                      : "3px solid #238636"
                    : "3px solid transparent",
                }}
              >
                <Box
                  sx={{
                    color: active
                      ? mode === "light"
                        ? "#2563eb"
                        : "#238636"
                      : mode === "light"
                      ? "#64748b"
                      : "#8b949e",
                  }}
                >
                  {item.icon}
                </Box>

                {open && (
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                      color: mode === "light" ? "#111" : "#c9d1d9",
                    }}
                  >
                    {item.text}
                  </Typography>
                )}
              </Box>
            </Link>
          );
        })}

        {/* ⭐ MOBILE LOGOUT BUTTON — only visible on XS */}
        {open && (
          <Box
            sx={{
              mt: "auto",
              px: 2,
              pb: 3,
              display: { xs: "flex", md: "none" },
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: mode === "light" ? "#ef4444" : "#f87171",
                borderColor: mode === "light" ? "#ef4444" : "#f87171",
                "&:hover": {
                  borderColor: "#dc2626",
                  background: mode === "light" ? "#fee2e2" : "#2d1b1b",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}
