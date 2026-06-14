import apiFetch from "../api";

async function createOfferService(produk_id, harga, target_id) {
  return await apiFetch("/api/penawaran", {
    method: "POST",
    body: JSON.stringify({ produk_id, harga, target_id })
  });
}

export { createOfferService };
