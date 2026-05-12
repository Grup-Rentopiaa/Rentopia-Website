import apiFetch from "../api";

export async function getItemsService(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await apiFetch(`/api/items?${query}`);
}

export async function getItemByIdService(id) {
  return await apiFetch(`/api/items/${id}`);
}

export async function createItemService(userId, data) {
  return await apiFetch(`/api/users/${userId}/items`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateItemService(id, userId, data) {
  return await apiFetch(`/api/users/${userId}/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteItemService(id, userId) {
  return await apiFetch(`/api/users/${userId}/items/${id}`, {
    method: "DELETE",
  });
}

export async function likeItemService(id, userId) {
  return await apiFetch(`/api/items/${id}/like`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function updateItemStatusService(id, status) {
  return await apiFetch(`/api/items/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getCategoriesService() {
  return await apiFetch("/api/items/categories");
}

export async function getLikedItemsService(userId) {
  return await apiFetch(`/api/items/liked?userId=${userId}`);
}
