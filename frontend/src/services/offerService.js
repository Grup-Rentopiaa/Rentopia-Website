import { BASE_URL, getAuthHeaders } from "./authService";

async function sendOfferService({ harga, target_id, produk_id = null }) {
  const payload = {
    harga: Number(harga),
    target_id: Number(target_id)
  };

  if (produk_id) {
    payload.produk_id = produk_id;
  }

  const res = await fetch(`${BASE_URL}/penawaran`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Gagal kirim penawaran");
  }

  return data;
}

export { sendOfferService };