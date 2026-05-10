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

export {
  BASE_URL,
  getAuthHeaders
};