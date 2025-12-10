import { Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import FolderIcon from "@mui/icons-material/Folder";
import { Link, useLocation } from "react-router-dom";
import { useThemeMode } from "../context/ThemeContext"; // ⭐ Add dark-mode hook

export default function Sidebar({ open }) {
  const WIDTH = open ? 200 : 64;
  const location = useLocation();
  const { mode } = useThemeMode(); // ⭐ Detect dark/light mode

  const menu = [
    { text: "Home", to: "/home", icon: <HomeIcon /> },
    { text: "My Projects", to: "/my-projects", icon: <FolderIcon /> },
    { text: "Settings", to: "/settings", icon: <SettingsIcon /> },
    { text: "About", to: "/about", icon: <InfoIcon /> },
  ];

  return (
    <Box
      className="sidebar"
      sx={{
        width: WIDTH,
        height: "100vh",

        /* ⭐ LIGHT VS DARK BACKGROUND */
        bgcolor: mode === "light" ? "#ffffff" : "#161b22",

        /* ⭐ BORDER COLOR */
        borderRight:
          mode === "light"
            ? "1px solid #e5e7eb"
            : "1px solid #30363d",

        transition: "width 0.25s ease",
        overflow: "hidden",
        py: 2,
        display: "flex",
        flexDirection: "column",
        color: mode === "light" ? "#111" : "#f0f6fc"
      }}
    >
      {/* SECTION TITLE */}
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

                /* ⭐ ACTIVE ITEM COLORS */
                bgcolor: active
                  ? mode === "light"
                    ? "#f1f5f9"
                    : "#1b1f24"
                  : "transparent",
                borderRight: active
                  ? mode === "light"
                    ? "3px solid #2563eb"
                    : "3px solid #238636" // GitHub green
                  : "3px solid transparent",

                /* ⭐ HOVER EFFECT */
                "&:hover": {
                  bgcolor:
                    mode === "light" ? "#f8fafc" : "#1f2933",
                },

                transition: "all 0.2s ease",
                color: mode === "light" ? "#111" : "#f0f6fc",
              }}
            >
              {/* ICON */}
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
                    color: active
                      ? mode === "light"
                        ? "#111"
                        : "#f0f6fc"
                      : mode === "light"
                        ? "#111"
                        : "#c9d1d9",
                  }}
                >
                  {item.text}
                </Typography>
              )}
            </Box>
          </Link>
        );
      })}

      <Box sx={{ flexGrow: 1 }} />

      {/* FOOTER */}
      {open && (
        <Typography
          sx={{
            fontSize: 12,
            textAlign: "center",
            mb: 2,
            color: mode === "light" ? "#cbd5e1" : "#8b949e",
          }}
        >
          Dev Showcase © 2025
        </Typography>
      )}
    </Box>
  );
}
