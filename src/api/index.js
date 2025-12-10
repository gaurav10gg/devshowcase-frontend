export const API_URL = "https://devshowcase-backen.onrender.com/api"; // change if needed

// token stored in localStorage after Supabase login
export function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}
