import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Eye, X } from "lucide-react";
import apiFetch from "../api";

export default function AdminGuaranteesPage() {
  const navigate = useNavigate();
  const [guarantees, setGuarantees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    apiFetch("/api/admin/guarantees")
      .then(data => setGuarantees(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message || "Akses ditolak"))
      .finally(() => setLoading(false));
  }, []);

  async function openDetail(id) {
    setDetailLoading(true);
    try {
      const data = await apiFetch(`/api/admin/guarantees/${id}`);
      setSelected(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setDetailLoading(false);
    }
  }

  const STATUS_BADGE = {
    pending: { label: "Pending", bg: "#E8DCFF", color: "#7B6AAA" },
    approved: { label: "Disetujui", bg: "#D6F0FF", color: "#2660A4" },
    guarantee_submitted: { label: "Jaminan Dikirim", bg: "#C9EFDC", color: "#2D7A55" },
    received: { label: "Diterima", bg: "#C9EFDC", color: "#2D7A55" },
    returned: { label: "Dikembalikan", bg: "#FFD6EC", color: "#9B4070" },
    reviewed: { label: "Diulas", bg: "#FFF3CD", color: "#C9873D" },
  };

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <nav className="rp-navbar">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)" }}>R</div>
          <span className="font-black text-lg" style={{ color: "#9B87D9" }}>Rentopia Admin</span>
          <span className="ml-2 rp-badge rp-badge-mint text-xs">Admin Panel</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="rp-back-btn mb-6">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={24} style={{ color: "#9B87D9" }} />
          <h1 className="text-xl font-black" style={{ color: "#3D2F6B" }}>Data Jaminan Penyewa</h1>
        </div>

        {error && (
          <div className="rp-card p-6 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <p className="font-bold" style={{ color: "#3D2F6B" }}>Akses Ditolak</p>
            <p className="text-sm mt-1" style={{ color: "#A89CC4" }}>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <div key={i} className="rp-skeleton h-16 rounded-2xl" />)}
          </div>
        ) : !error && (
          <div className="rp-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#FAF8FF", borderBottom: "2px solid #E8DCFF" }}>
                  {["Kode Sewa", "Penyewa", "Produk", "Tanggal", "Status", "Aksi"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-black" style={{ color: "#7B6AAA" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guarantees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center" style={{ color: "#A89CC4" }}>Belum ada data jaminan</td>
                  </tr>
                ) : guarantees.map(g => {
                  const badge = STATUS_BADGE[g.status] || STATUS_BADGE.pending;
                  return (
                    <tr key={g.id} style={{ borderBottom: "1px solid #E8DCFF" }}>
                      <td className="px-4 py-3 font-black text-xs" style={{ color: "#9B87D9" }}>{g.rentalCode || "—"}</td>
                      <td className="px-4 py-3" style={{ color: "#3D2F6B" }}>{g.buyer?.username}</td>
                      <td className="px-4 py-3" style={{ color: "#7B6AAA" }}>{g.item?.title || "—"}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#A89CC4" }}>{new Date(g.createdAt).toLocaleDateString("id-ID")}</td>
                      <td className="px-4 py-3">
                        <span className="rp-badge text-[10px]" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openDetail(g.id)}
                          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                          style={{ background: "#E8DCFF", color: "#9B87D9" }}
                        >
                          <Eye size={12} /> Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {(selected || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setSelected(null)}>
          <div className="rp-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black" style={{ color: "#3D2F6B" }}>Detail Jaminan</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-xl" style={{ background: "#E8DCFF" }}><X size={16} style={{ color: "#9B87D9" }} /></button>
            </div>

            {detailLoading ? (
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => <div key={i} className="rp-skeleton h-10 rounded-xl" />)}
              </div>
            ) : selected && (
              <div className="space-y-4 text-sm">
                <Row label="Kode Sewa" value={selected.rentalCode || "—"} highlight />
                <Row label="Penyewa" value={selected.buyer?.username} />
                <Row label="Email" value={selected.buyer?.email} />
                <Row label="Produk" value={selected.item?.title || "—"} />
                <Row label="Durasi" value={`${selected.durationDays || "—"} hari`} />
                <Row label="Status" value={selected.status} />
                {selected.startDate && <Row label="Mulai" value={new Date(selected.startDate).toLocaleDateString("id-ID")} />}
                {selected.endDate && <Row label="Berakhir" value={new Date(selected.endDate).toLocaleDateString("id-ID")} />}

                {selected.guaranteeData && (
                  <>
                    <div className="border-t pt-4" style={{ borderColor: "#E8DCFF" }}>
                      <p className="font-black mb-3" style={{ color: "#3D2F6B" }}>Data Jaminan (Terenkripsi)</p>
                    </div>
                    <Row label="Nama Lengkap" value={selected.guaranteeData.fullName} />
                    <Row label="Nomor HP" value={selected.guaranteeData.phone} />
                    <Row label="Alamat" value={selected.guaranteeData.address} />
                    {selected.guaranteeData.ktpB64 && (
                      <div>
                        <p className="font-bold mb-1.5 text-xs" style={{ color: "#7B6AAA" }}>Foto KTP</p>
                        <img src={selected.guaranteeData.ktpB64} alt="KTP" className="w-full rounded-xl object-cover" style={{ maxHeight: 200 }} />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="font-bold text-xs" style={{ color: "#7B6AAA", flexShrink: 0 }}>{label}</span>
      <span className={`text-right ${highlight ? "font-black" : "font-semibold"}`} style={{ color: highlight ? "#9B87D9" : "#3D2F6B" }}>{value || "—"}</span>
    </div>
  );
}
