import { useState } from "react";
import { X, ShieldCheck, Upload } from "lucide-react";
import apiFetch from "../api";

export default function GuaranteeModal({ buyerId, sellerId, itemId, onSuccess, onClose }) {
  const [form, setForm] = useState({ fullName:"", phone:"", address:"", durationDays:"" });
  const [ktpPreview, setKtpPreview] = useState(null);
  const [ktpB64, setKtpB64] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rentalCode, setRentalCode] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function handleChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); }
  function handleKtp(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setKtpPreview(ev.target.result); setKtpB64(ev.target.result); };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address || !form.durationDays) {
      setError("Semua field wajib diisi!"); return;
    }
    setSubmitting(true); setError("");
    try {
      const res = await apiFetch("/api/rental/guarantee", {
        method: "POST",
        body: JSON.stringify({ buyerId, sellerId, itemId, ...form, ktpB64 }),
      });
      setRentalCode(res.rentalCode);
      setTimeout(() => onSuccess(res), 3000);
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  }

  function copyCode() {
    navigator.clipboard.writeText(rentalCode).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(61,47,107,0.4)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg,#E8DCFF,#FFD6EC)", borderRadius:"24px 24px 0 0" }}>
          <div>
            <h2 className="font-black text-base" style={{ color:"#3D2F6B" }}>Data Jaminan Penyewa</h2>
            <p className="text-xs mt-0.5" style={{ color:"#7B6AAA" }}>Hanya dapat diakses oleh admin Rentopia</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ background:"#E8DCFF" }}><X size={16} style={{ color:"#9B87D9" }} /></button>
        </div>

        {rentalCode ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-black text-lg mb-2" style={{ color:"#3D2F6B" }}>Berhasil!</h3>
            <p className="text-sm mb-4" style={{ color:"#7B6AAA" }}>Data jaminan terkirim. Kode sewamu:</p>
            <div className="rounded-2xl px-6 py-4 mb-4 cursor-pointer" style={{ background:"#E8DCFF" }} onClick={copyCode}>
              <p className="text-xl font-black tracking-wider" style={{ color:"#3D2F6B" }}>{rentalCode}</p>
              <p className="text-xs mt-1" style={{ color:"#9B87D9" }}>{copied ? "✅ Disalin!" : "Klik untuk menyalin"}</p>
            </div>
            <p className="text-xs" style={{ color:"#A89CC4" }}>Menutup otomatis dalam 3 detik...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ background:"#FFD6EC", color:"#9B4070" }}>{error}</div>}
            {[
              { name:"fullName", label:"Nama Lengkap *", placeholder:"Sesuai KTP", type:"text" },
              { name:"phone", label:"Nomor Telepon *", placeholder:"08xxxxxxxxxx", type:"tel" },
              { name:"durationDays", label:"Lama Sewa (hari) *", placeholder:"cth: 3", type:"number", min:"1" },
            ].map(f => (
              <div key={f.name}>
                <label className="text-xs font-bold mb-1.5 block" style={{ color:"#7B6AAA" }}>{f.label}</label>
                <input {...f} name={f.name} value={form[f.name]} onChange={handleChange} className="rp-input" />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color:"#7B6AAA" }}>Alamat Lengkap *</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={3} placeholder="Alamat sesuai KTP" className="rp-input resize-none" />
            </div>
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color:"#7B6AAA" }}>Foto KTP</label>
              <label className="flex flex-col items-center justify-center h-24 cursor-pointer rounded-2xl transition-all" style={{ border:"2px dashed #C9B8FF", background:"#FAF8FF" }}>
                {ktpPreview
                  ? <img src={ktpPreview} className="w-full h-full object-cover rounded-2xl" alt="ktp" />
                  : <><Upload size={22} style={{ color:"#C9B8FF" }} /><span className="text-xs mt-1" style={{ color:"#9B87D9" }}>Upload KTP</span></>}
                <input type="file" accept="image/*" onChange={handleKtp} className="hidden" />
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="rp-btn-outline flex-1 py-3">Batal</button>
              <button type="submit" disabled={submitting} className="rp-btn-primary flex-1 py-3">
                <ShieldCheck size={16} /> {submitting ? "Mengirim..." : "Kirim Data Jaminan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
