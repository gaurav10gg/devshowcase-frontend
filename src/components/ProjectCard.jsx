import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  IconButton
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import { useThemeMode } from "../context/ThemeContext"; // ⭐ add dark mode hook

export default function ProjectCard({
  title,
  short_desc,
  image,
  likes,
  comments,
  liked,
  onLike,
  onClick,
  onCommentsClick,
}) {
  const { mode } = useThemeMode(); // ⭐ detect mode

  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: "14px",
        cursor: "pointer",
        overflow: "hidden",
        transition: "0.2s",

        /* ⭐ BACKGROUND + BORDER for Dark Mode */
        bgcolor: mode === "light" ? "#ffffff" : "#1b1f24",
        border:
          mode === "light"
            ? "1px solid #e5e7eb"
            : "1px solid #30363d",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            mode === "light"
              ? "0 8px 26px rgba(0,0,0,0.12)"
              : "0 8px 26px rgba(0,0,0,0.55)",
        },
      }}
    >
      {/* Thumbnail */}
      <CardMedia
        component="img"
        height="180"
        image={image}
        alt={title}
        sx={{
          objectFit: "cover",
          /* Slight dark blend for dark mode thumbnails */
          filter: mode === "light" ? "none" : "brightness(0.85)",
        }}
      />

      {/* Content */}
      <CardContent
        sx={{
          color: mode === "light" ? "#111" : "#f0f6fc",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: mode === "light" ? "#111" : "#f0f6fc",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: mode === "light" ? "#64748b" : "#8b949e",
            mb: 2,
          }}
        >
          {short_desc}
        </Typography>

        {/* Footer: Likes + Comments */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          
          {/* Like Button */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onLike && onLike();
              }}
              sx={{
                color: mode === "light" ? "#111" : "#f0f6fc",
              }}
            >
              {liked ? (
                <FavoriteIcon sx={{ color: "#e63946" }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                color: mode === "light" ? "#111" : "#f0f6fc",
              }}
            >
              {likes}
            </Typography>
          </Box>

          {/* Comment Button */}
          <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onCommentsClick && onCommentsClick();
              }}
              sx={{
                color: mode === "light" ? "#111" : "#f0f6fc",
              }}
            >
              <ChatBubbleOutlineIcon
                sx={{
                  fontSize: "20px",
                  opacity: 0.7,
                }}
              />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                ml: 0.5,
                color: mode === "light" ? "#111" : "#f0f6fc",
              }}
            >
              {comments}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
