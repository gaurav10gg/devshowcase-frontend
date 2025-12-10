import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById, likeProject, unlikeProject } from "../api/projects";
import { getAuthHeaders } from "../api/index";
import axios from "axios";

export default function ProjectPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  // -----------------------------
  // LOAD PROJECT
  // -----------------------------
  async function loadProject() {
    try {
      const data = await fetchProjectById(id);
      setProject(data);
    } catch (err) {
      console.log("Failed to load project:", err);
    }
  }

  // -----------------------------
  // LOAD COMMENTS
  // -----------------------------
  async function loadComments() {
    try {
      const res = await axios.get(
        `${API_URL}/comments/${id}`
      );
      setComments(res.data);
    } catch (err) {
      console.log("Failed to load comments:", err);
    }
  }

  // -----------------------------
  // LIKE / UNLIKE
  // -----------------------------
  async function handleLike() {
    if (!project) return;

    try {
      if (project.liked) {
        const res = await unlikeProject(project.id);
        setProject({ ...project, likes: res.likes, liked: res.liked });
      } else {
        const res = await likeProject(project.id);
        setProject({ ...project, likes: res.likes, liked: res.liked });
      }
    } catch (err) {
      console.log("Like failed:", err);
    }
  }

  // -----------------------------
  // ADD COMMENT
  // -----------------------------
  async function handleAddComment() {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/comments/${id}`,
        { text: commentText },
        { headers: getAuthHeaders() }
      );

      setComments([...comments, res.data]);
      setCommentText("");
    } catch (err) {
      console.log("Failed to add comment:", err);
    }
  }

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    async function init() {
      await loadProject();
      await loadComments();
      setLoading(false);
    }
    init();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!project) return <div className="p-6">Project not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* IMAGE */}
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-72 object-cover rounded-xl"
      />

      {/* TITLE */}
      <h1 className="text-3xl font-bold mt-4">{project.title}</h1>

      {/* SHORT DESCRIPTION */}
      <p className="text-gray-600 mt-2">{project.short_desc}</p>

      {/* FULL DESCRIPTION */}
      <p className="text-gray-700 mt-4 leading-7">{project.full_desc}</p>

      {/* EXTERNAL LINKS */}
      <div className="flex gap-3 mt-5">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            className="px-4 py-2 border rounded-lg text-sm"
          >
            GitHub
          </a>
        )}

        {project.live && (
          <a
            href={project.live}
            target="_blank"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Live Demo
          </a>
        )}
      </div>

      {/* LIKES */}
      <button
        onClick={handleLike}
        className="mt-4 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
      >
        {project.liked ? "❤️" : "🤍"} {project.likes} Likes
      </button>

      {/* COMMENTS SECTION */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Comments</h2>

        {/* ADD COMMENT */}
        <div className="flex gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border px-3 py-2 rounded-lg"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Post
          </button>
        </div>

        {/* COMMENT LIST */}
        <div className="mt-5 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="border p-3 rounded-lg">
              <p className="font-medium">{c.user_name || "User"}</p>
              <p className="text-gray-700">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
