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

  async function loadProject() {
    const data = await fetchProjectById(id);
    setProject(data);
  }

  async function loadComments() {
    const res = await axios.get(
      `http://localhost:5000/api/comments/${id}`
    );
    setComments(res.data);
  }

  async function handleLike() {
    if (!project) return;

    const endpoint = project.liked ? unlikeProject : likeProject;
    const res = await endpoint(project.id);

    setProject((prev) => ({
      ...prev,
      likes: res.likes,
      liked: res.liked,
    }));
  }

  async function handleAddComment() {
    if (!commentText.trim()) return;

    const res = await axios.post(
      `http://localhost:5000/api/comments/${id}`,
      { text: commentText },
      { headers: getAuthHeaders() }
    );

    setComments((prev) => [...prev, res.data]);
    setCommentText("");
  }

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
      {/* Image */}
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-72 object-cover rounded-xl"
      />

      {/* Title */}
      <h1 className="text-3xl font-bold mt-4">{project.title}</h1>

      <p className="text-gray-600 mt-2">{project.short_desc}</p>

      <p className="text-gray-700 mt-4 leading-7">{project.full_desc}</p>

      {/* Buttons */}
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

      {/* Likes */}
      <button
        onClick={handleLike}
        className="mt-4 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
      >
        {project.liked ? "❤️" : "🤍"} {project.likes} Likes
      </button>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Comments</h2>

        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 border px-3 py-2 rounded-lg"
            placeholder="Add a comment…"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Post
          </button>
        </div>

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
