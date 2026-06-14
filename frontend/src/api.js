const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const API_URL = BASE_URL;
export const WS_URL  = import.meta.env.VITE_WS_URL  || BASE_URL.replace(/^http/, "ws");

export default async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  }  catch {
      window.location.href = "/error-500";
      return;
  }

  if (res.status >= 500) {
    window.location.href = "/error-500";
    return;
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return null;

  return res.json();
}