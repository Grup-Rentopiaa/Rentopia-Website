import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Tag, ArrowLeft } from "lucide-react";
import { createOfferService } from "../services/offerService";

export default function OfferPage({ setActivePage }) {
  const user     = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const product = (() => {
    try {
      const s = localStorage.getItem('targetChatProduct');
      return s ? JSON.parse(s) : { title: "Produk", price: 0 };
    } catch { return { title: "Produk", price: 0 }; }
  })();

  const [harga, setHarga] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleBack() {
    if (setActivePage) setActivePage('chat');
    else navigate("/chat");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const targetId = Number(localStorage.getItem("targetChatId"));

    if (!harga || Number(harga) <= 0) {
      setError("Masukkan harga penawaran yang valid");
      return;
    }
    if (!targetId) {
      setError("Target chat tidak ditemukan");
      return;
    }

    setLoading(true);
    try {
      await createOfferService(product.id, Number(harga), targetId);
      handleBack();
    } catch (err) {
      setError(err.message || "Gagal mengirim penawaran");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#FAF8FF" }}>
      <div className="w-full max-w-sm rp-card overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #E8DCFF, #FFD6EC)" }}>
          <div className="flex items-center gap-2">
            <Tag size={18} style={{ color: "#9B87D9" }} />
            <h2 className="font-black text-base" style={{ color: "#3D2F6B" }}>Buat Penawaran</h2>
          </div>
          <button onClick={handleBack} className="rp-back-btn text-xs px-2 py-1">
            <ArrowLeft size={14} /> Batal
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Product info */}
          <div className="flex items-center gap-3 p-3 rounded-2xl"
            style={{ background: "#FAF8FF", border: "1px solid #E8DCFF" }}>
            {product.image && (
              <img src={product.image} alt={product.title}
                className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: "#3D2F6B" }}>
                {product.title}
              </p>
              <p className="text-xs font-semibold" style={{ color: "#9B87D9" }}>
                Harga: Rp {Number(product.price || 0).toLocaleString('id-ID')}/hari
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "#FFD6EC", color: "#9B4070" }}>
              {error}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>
                Harga Tawaran (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                  style={{ color: "#C9B8FF" }}>Rp</span>
                <input
                  type="number"
                  placeholder="Masukkan harga tawaran"
                  value={harga}
                  onChange={e => setHarga(e.target.value)}
                  min="1"
                  className="rp-input pl-10"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={handleBack} className="rp-btn-outline flex-1 py-3">
                Batal
              </button>
              <button type="submit" disabled={loading} className="rp-btn-primary flex-1 py-3">
                {loading ? "Mengirim..." : "Kirim Penawaran"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
