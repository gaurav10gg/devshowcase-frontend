import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../context/ThemeContext"; // ⭐ Import theme hook

export default function Navbar({ onSignIn, onAboutClick }) {
  const [open, setOpen] = useState(false);
  const { mode, toggleTheme } = useThemeMode(); // ⭐ Get theme mode and toggle

  const toggleDrawer = () => setOpen(!open);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: mode === "light" ? "white" : "#161b22", // ⭐ Dynamic bg
          borderBottom: mode === "light" 
            ? "1px solid #e5e7eb" 
            : "1px solid #30363d", // ⭐ Dynamic border
          px: { xs: 1, md: 3 },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* LOGO */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: mode === "light" ? "#111" : "#f0f6fc", // ⭐ Dynamic color
              letterSpacing: "-0.5px",
              cursor: "pointer",
            }}
          >
            DevShowcase
          </Typography>

          {/* DESKTOP MENU */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
            {/* ⭐ THEME TOGGLE BUTTON */}
            <IconButton 
              onClick={toggleTheme}
              sx={{ 
                color: mode === "light" ? "#111" : "#f0f6fc",
              }}
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            <Button
              variant="text"
              onClick={onAboutClick}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: mode === "light" ? "#111" : "#f0f6fc", // ⭐ Dynamic color
                "&:hover": { 
                  color: mode === "light" ? "#1976d2" : "#60a5fa", // ⭐ Dynamic hover
                  background: "transparent" 
                },
              }}
            >
              About
            </Button>

            {/* PREMIUM SIGN IN BUTTON */}
            <Button
              variant="contained"
              onClick={onSignIn}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                px: 3,
                py: 1,
                fontSize: "0.95rem",
                backgroundColor: mode === "light" ? "#1976d2" : "#3b82f6", // ⭐ Dynamic bg
                boxShadow: mode === "light"
                  ? "0 3px 10px rgba(25,118,210,0.25)"
                  : "0 3px 10px rgba(59,130,246,0.25)",
                "&:hover": {
                  backgroundColor: mode === "light" ? "#145a9e" : "#2563eb",
                  boxShadow: mode === "light"
                    ? "0 5px 14px rgba(25,118,210,0.35)"
                    : "0 5px 14px rgba(59,130,246,0.35)",
                },
              }}
            >
              Sign In
            </Button>
          </Box>

          {/* MOBILE MENU BUTTON */}
          <IconButton
            sx={{ 
              display: { xs: "flex", md: "none" },
              color: mode === "light" ? "#111" : "#f0f6fc", // ⭐ Dynamic color
            }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer 
        anchor="right" 
        open={open} 
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            bgcolor: mode === "light" ? "#fff" : "#161b22", // ⭐ Dynamic drawer bg
            color: mode === "light" ? "#111" : "#f0f6fc",
          }
        }}
      >
        <Box
          sx={{
            width: 260,
            mt: 3,
            px: 2,
          }}
        >
          <List>
            {/* ⭐ THEME TOGGLE IN MOBILE */}
            <ListItem disablePadding>
              <ListItemButton onClick={toggleTheme}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                  <ListItemText
                    primary={mode === "light" ? "Dark Mode" : "Light Mode"}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </Box>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                toggleDrawer();
                onAboutClick();
              }}>
                <ListItemText
                  primary="About"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={onSignIn}>
                <ListItemText
                  primary="Sign In"
                  primaryTypographyProps={{ 
                    fontWeight: 600, 
                    color: mode === "light" ? "#1976d2" : "#60a5fa" // ⭐ Dynamic accent
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}