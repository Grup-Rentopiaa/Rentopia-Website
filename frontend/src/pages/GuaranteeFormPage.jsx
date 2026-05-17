import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Upload } from "lucide-react";
import apiFetch from "../api";
import AppNavbar from "../components/AppNavbar";

export default function GuaranteeFormPage() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // conversationId format: "buyerId-sellerId-itemId"
  const [parts] = useState(() => {
    const p = (conversationId || "").split("-");
    return { buyerId: parseInt(p[0]), sellerId: parseInt(p[1]), itemId: parseInt(p[2]) };
  });

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    ktpB64: null,
    durationDays: "",
  });
  const [ktpPreview, setKtpPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [rentalCode, setRentalCode] = useState(null);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleKtp(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setKtpPreview(ev.target.result);
      setForm(prev => ({ ...prev, ktpB64: ev.target.result }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address || !form.durationDays) {
      setError("Semua field wajib diisi!");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await apiFetch("/api/rental/guarantee", {
        method: "POST",
        body: JSON.stringify({
          buyerId: parts.buyerId,
          sellerId: parts.sellerId,
          itemId: parts.itemId,
          ...form,
        }),
      });
      setRentalCode(res.rentalCode);
    } catch (err) {
      setError(err.message || "Gagal mengirim data jaminan");
    } finally {
      setSubmitting(false);
    }
  }

  if (rentalCode) {
    return (
      <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
        <AppNavbar />
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="rp-card p-10">
            <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, #C9EFDC, #A0DFC0)" }}>
              <ShieldCheck size={36} style={{ color: "#2D7A55" }} />
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: "#3D2F6B" }}>Data Jaminan Terkirim!</h2>
            <p className="text-sm mb-6" style={{ color: "#7B6AAA" }}>
              Penjual akan menghubungimu untuk proses COD. Simpan kode sewamu di bawah ini.
            </p>
            <div className="rounded-2xl px-6 py-4 mb-6" style={{ background: "#E8DCFF" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "#9B87D9" }}>KODE SEWAMU</p>
              <p className="text-xl font-black tracking-wider" style={{ color: "#3D2F6B" }}>{rentalCode}</p>
            </div>
            <button onClick={() => navigate("/chat")} className="rp-btn-primary w-full">
              Kembali ke Chat
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <AppNavbar />

      <main className="max-w-lg mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="rp-back-btn mb-6">
          <ArrowLeft size={16} /> Kembali ke Chat
        </button>

        <div className="rp-card overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b" style={{ borderColor: "#E8DCFF", background: "linear-gradient(135deg, #E8DCFF, #FFD6EC)" }}>
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} style={{ color: "#9B87D9" }} />
              <div>
                <h1 className="font-black" style={{ color: "#3D2F6B" }}>Formulir Data Jaminan</h1>
                <p className="text-xs" style={{ color: "#7B6AAA" }}>Data ini bersifat rahasia dan hanya bisa diakses admin</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: "#FFD6EC", color: "#9B4070" }}>
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>Nama Lengkap *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Sesuai KTP" className="rp-input" />
            </div>

            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>Nomor HP *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="08xxxxxxxxxx" className="rp-input" />
            </div>

            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>Alamat *</label>
              <textarea name="address" value={form.address} onChange={handleChange} placeholder="Alamat lengkap sesuai KTP" rows={3} className="rp-input resize-none" />
            </div>

            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>Foto KTP</label>
              <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer rounded-2xl transition-all" style={{ border: "2px dashed #C9B8FF", background: "#FAF8FF" }}>
                {ktpPreview ? (
                  <img src={ktpPreview} alt="KTP" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Upload size={24} style={{ color: "#C9B8FF", marginBottom: 6 }} />
                    <span className="text-sm font-bold" style={{ color: "#9B87D9" }}>Upload foto KTP</span>
                    <span className="text-xs" style={{ color: "#A89CC4" }}>JPG / PNG</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleKtp} className="hidden" />
              </label>
            </div>

            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>Durasi Sewa (hari) *</label>
              <input name="durationDays" type="number" value={form.durationDays} onChange={handleChange} placeholder="Contoh: 3" min="1" className="rp-input" />
            </div>

            <button type="submit" disabled={submitting} className="rp-btn-primary w-full py-3.5 mt-2">
              {submitting ? "Mengirim..." : <><ShieldCheck size={18} /> Kirim Data Jaminan</>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
