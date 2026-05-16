import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { createOfferService } from "../services/offerService";

export default function OfferPage({ setActivePage }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const productStr = localStorage.getItem('targetChatProduct');
  const product = productStr ? JSON.parse(productStr) : { title: "Produk", price: 0 };

  const [harga, setHarga] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const targetId = Number(localStorage.getItem("targetChatId"));

    if (!harga || Number(harga) <= 0) {
      setError("Harga tidak valid");
      return;
    }

    if (!targetId) {
      setError("Target chat tidak ditemukan");
      return;
    }

    try {
      await createOfferService(product.id, Number(harga), targetId);
      if (setActivePage) setActivePage('chat');
      else navigate("/chat");
    } catch (err) {
      setError(err.message || "Gagal kirim penawaran");
    }
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="offer-overlay">
      <form className="offer-box" onSubmit={handleSubmit}>
        <h3>Buat Penawaran</h3>

        <div className="flex items-center gap-4 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          {product.image && <img src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded-lg" />}
          <div>
            <p className="text-sm font-bold text-slate-800">{product.title}</p>
            <p className="text-xs text-purple-600 font-semibold">Harga: Rp {product.price.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <input
          type="number"
          placeholder="Masukkan harga tawaran"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
        />

        {error && <p className="offer-error">{error}</p>}

        <div className="offer-actions">
          <button type="submit" className="offer-submit">
            Kirim
          </button>

          <button
            type="button"
            className="offer-cancel"
            onClick={() => setActivePage ? setActivePage('chat') : navigate("/chat")}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
