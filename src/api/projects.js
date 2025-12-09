import axios from "axios";
import { API_URL, getAuthHeaders } from "./index";

export async function fetchProjects() {
  const res = await axios.get(`${API_URL}/projects`);
  return res.data;
}

export async function likeProject(id) {
  const res = await axios.post(
    `${API_URL}/projects/${id}/like`,
    {},
    { headers: getAuthHeaders() }
  );
  return res.data;
}

export async function unlikeProject(id) {
  const res = await axios.delete(
    `${API_URL}/projects/${id}/like`,
    { headers: getAuthHeaders() }
  );
  return res.data;
}
