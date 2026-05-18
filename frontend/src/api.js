// ── api.js ────────────────────────────────────────────────────────────────────
// Satu file ini yang mengatur semua komunikasi ke backend.
// Jangan pernah tulis http://localhost:3000 langsung di komponen manapun.
// Semua request harus lewat fungsi apiFetch() ini.

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const API_URL = BASE_URL;
export const WS_URL  = import.meta.env.VITE_WS_URL  || BASE_URL.replace(/^http/, "ws");

/**
 * Wrapper fetch yang otomatis:
 * - Attach Authorization header dari localStorage
 * - Set Content-Type: application/json
 * - Throw error dengan message dari server kalau response tidak ok
 */
export default async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {}
    throw new Error(message);
  }

  // 204 No Content — tidak ada body
  if (res.status === 204) return null;

  return res.json();
}
