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

export default function Navbar({ onSignIn }) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e5e7eb",
          px: { xs: 1, md: 3 },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* LOGO */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#111",
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
            <Button
              variant="text"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "#111",
                "&:hover": { color: "#1976d2", background: "transparent" },
              }}
            >
              Home
            </Button>

            <Button
              variant="text"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "#111",
                "&:hover": { color: "#1976d2", background: "transparent" },
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
                backgroundColor: "#1976d2",
                boxShadow: "0 3px 10px rgba(25,118,210,0.25)",
                "&:hover": {
                  backgroundColor: "#145a9e",
                  boxShadow: "0 5px 14px rgba(25,118,210,0.35)",
                },
              }}
            >
              Sign In
            </Button>
          </Box>

          {/* MOBILE MENU BUTTON */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box
          sx={{
            width: 260,
            mt: 3,
            px: 2,
          }}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary="Home"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton>
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
                  primaryTypographyProps={{ fontWeight: 600, color: "#1976d2" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
