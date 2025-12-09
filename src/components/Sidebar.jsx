import { Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import FolderIcon from "@mui/icons-material/Folder";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ open }) {
  const WIDTH = open ? 200 : 64;
  const location = useLocation();

  const menu = [
    { text: "Home", to: "/home", icon: <HomeIcon /> },
    { text: "My Projects", to: "/my-projects", icon: <FolderIcon /> },
    { text: "Settings", to: "/settings", icon: <SettingsIcon /> },
    { text: "About", to: "/about", icon: <InfoIcon /> },
  ];

  return (
    <Box
      sx={{
        width: WIDTH,
        height: "100vh",
        bgcolor: "white",
        borderRight: "1px solid #e5e7eb",
        transition: "width 0.25s ease",
        overflow: "hidden",
        py: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* SECTION TITLE */}
      {open && (
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: "#94a3b8",
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
                bgcolor: active ? "#f1f5f9" : "transparent",
                borderRight: active ? "3px solid #2563eb" : "3px solid transparent",
                "&:hover": { bgcolor: "#f8fafc" },
                transition: "all 0.2s ease",
              }}
            >
              {item.icon}
              {open && (
                <Typography sx={{ fontSize: 14, fontWeight: active ? 600 : 500 }}>
                  {item.text}
                </Typography>
              )}
            </Box>
          </Link>
        );
      })}

      {/* FILLER SECTION TO AVOID EMPTY FEELING */}
      <Box sx={{ flexGrow: 1 }} />

      {/* FOOTER OR LOGO AREA */}
      {open && (
        <Typography
          sx={{
            fontSize: 12,
            textAlign: "center",
            mb: 2,
            color: "#cbd5e1",
          }}
        >
          Dev Showcase © 2025
        </Typography>
      )}
    </Box>
  );
}
