import apiFetch from "../api";

async function getUsersService() {
  const data = await apiFetch("/api/chat/users");
  return Array.isArray(data) ? data : data.data || [];
}

async function getMessagesService(targetId) {
  return await apiFetch(`/api/chat/messages/${targetId}`);
}

async function sendMessageService(targetId, text) {
  const data = await apiFetch(`/api/chat/messages/${targetId}`, {
    method: "POST",
    body: JSON.stringify({ text })
  });
  return data.data;
}

export {
  getUsersService,
  getMessagesService,
  sendMessageService
};
