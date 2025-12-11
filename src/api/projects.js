import axios from "axios";
import { API_URL, getAuthHeaders } from "./index";

export async function fetchProjects() {
  const res = await axios.get(`${API_URL}/projects`);
  return res.data;
}

export async function likeProject(id) {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/api/projects/${id}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}


export async function fetchProjectById(id) {
  const res = await axios.get(`${API_URL}/projects/${id}`);
  return res.data;
}

export async function unlikeProject(id) {
  const token = localStorage.getItem("token");
  const res = await axios.delete(
    `${API_URL}/api/projects/${id}/like`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
