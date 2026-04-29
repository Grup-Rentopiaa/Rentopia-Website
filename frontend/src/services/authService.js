const BASE_URL = "http://127.0.0.1:3001";

function getToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders(includeJson = false) {
  const headers = {};

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

async function loginService({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login gagal");
  }

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  if (data.user) {
    localStorage.setItem("currentUser", JSON.stringify(data.user));
  }

  return data;
}

async function registerService(payload) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Register gagal");
  }

  return data;
}

async function getMeService() {
  const res = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    credentials: "include",
    headers: getAuthHeaders()
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Unauthorized");
  }

  return data.user;
}

async function logoutService() {
  try {
    await fetch(`${BASE_URL}/logout`, {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders()
    });
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("targetChatId");
    localStorage.removeItem("pesanPenawaran");
  }
}

export {
  BASE_URL,
  getAuthHeaders,
  loginService,
  registerService,
  getMeService,
  logoutService
};