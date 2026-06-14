import { useState } from "react";
import { X, Upload } from "lucide-react";
import apiFetch from "../api";

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
          style={{ fontSize:32, lineHeight:1 }}>
          <span style={{ color: s <= (hover||value) ? "#FFB3D9" : "#E8DCFF" }}>★</span>
        </button>
      ))}
    </div>
  );
}

export default function ReviewModal({ rentalId, onSuccess, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photoB64, setPhotoB64] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handlePhoto(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { setPhotoPreview(ev.target.result); setPhotoB64(ev.target.result); };
    r.readAsDataURL(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) { setError("Komentar wajib diisi"); return; }
    setSubmitting(true); setError("");
    try {
      await apiFetch(`/api/rental/${rentalId}/review`, {
        method:"POST",
        body: JSON.stringify({ rating, comment, photoB64 }),
      });
      onSuccess();
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(61,47,107,0.4)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 flex items-center justify-between" style={{ background:"linear-gradient(135deg,#E8DCFF,#FFD6EC)", borderRadius:"24px 24px 0 0" }}>
          <h2 className="font-black" style={{ color:"#3D2F6B" }}>⭐ Tulis Ulasan</h2>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ background:"#E8DCFF" }}><X size={16} style={{ color:"#9B87D9" }} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background:"#FFD6EC", color:"#9B4070" }}>{error}</div>}
          <div>
            <label className="text-xs font-bold mb-2 block" style={{ color:"#7B6AAA" }}>Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color:"#7B6AAA" }}>Komentar *</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Ceritakan pengalamanmu..." className="rp-input resize-none" />
          </div>
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color:"#7B6AAA" }}>Foto (opsional)</label>
            <label className="flex items-center justify-center h-20 cursor-pointer rounded-2xl" style={{ border:"2px dashed #C9B8FF", background:"#FAF8FF" }}>
              {photoPreview
                ? <img src={photoPreview} className="w-full h-full object-cover rounded-2xl" alt="photo" />
                : <><Upload size={18} style={{ color:"#C9B8FF" }} /><span className="text-xs ml-2" style={{ color:"#9B87D9" }}>Upload foto</span></>}
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="rp-btn-outline flex-1 py-3">Batal</button>
            <button type="submit" disabled={submitting} className="rp-btn-primary flex-1 py-3">
              {submitting ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
