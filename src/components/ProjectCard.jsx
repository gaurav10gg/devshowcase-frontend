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


export default function ProjectCard({
  title,
  short_desc,
  image,
  likes,
  comments,
  liked,
  onLike,
  onClick,
  onCommentsClick, // 🆕
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: "14px",
        cursor: "pointer",
        overflow: "hidden",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 26px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Thumbnail */}
      <CardMedia
        component="img"
        height="180"
        image={image}
        alt={title}
        sx={{ objectFit: "cover" }}
      />

      {/* Content */}
      <CardContent>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 1, color: "#111" }}
        >
          {title}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
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
            >
              {liked ? (
                <FavoriteIcon sx={{ color: "#e63946" }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography variant="body2">{likes}</Typography>
          </Box>

          {/* Comment Count / Button */}
          <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onCommentsClick && onCommentsClick();
              }}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: "20px", opacity: 0.7 }} />
            </IconButton>
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {comments}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
