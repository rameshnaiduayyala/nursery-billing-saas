const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1";

export async function apiRequest(path, options = {}) {
  const currentOrg = localStorage.getItem("nursery_current_org");
  const token = localStorage.getItem("nursery_token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(currentOrg ? { "x-organization-id": currentOrg } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }
  return payload;
}
