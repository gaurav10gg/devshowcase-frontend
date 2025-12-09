export const API_URL = "http://localhost:5000/api"; // change if needed

// token stored in localStorage after Supabase login
export function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}
