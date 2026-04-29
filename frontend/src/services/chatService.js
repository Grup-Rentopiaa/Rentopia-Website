import { BASE_URL, getAuthHeaders } from "./authService";

async function getUsersService() {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "GET",
    credentials: "include",
    headers: getAuthHeaders()
  });

  const data = await res.json();
  console.log("GET USERS RAW:", data);

  if (!res.ok) {
    throw new Error(data.error || "Gagal mengambil user");
  }

  return Array.isArray(data) ? data : data.data || [];
}

async function getMessagesService(targetId) {
  const res = await fetch(`${BASE_URL}/messages/${targetId}`, {
    method: "GET",
    credentials: "include",
    headers: getAuthHeaders()
  });

  const data = await res.json();
  console.log("GET MESSAGES RAW:", data);

  if (!res.ok) {
    throw new Error(data.error || "Gagal mengambil pesan");
  }

  return data;
}

async function sendMessageService(targetId, text) {
  const res = await fetch(`${BASE_URL}/messages/${targetId}`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ text })
  });

  const data = await res.json();
  console.log("POST MESSAGE RAW:", data);

  if (!res.ok) {
    throw new Error(data.error || "Pesan gagal dikirim");
  }

  return data.data;
}

export {
  getUsersService,
  getMessagesService,
  sendMessageService
};