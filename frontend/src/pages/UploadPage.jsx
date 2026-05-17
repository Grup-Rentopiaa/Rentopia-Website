import { Upload, ImagePlus, Tag, MapPin, FileText, ChevronDown, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useItems } from '../hooks/useItems';
import { useUser } from '../hooks/useUser';
import { getItemByIdService, updateItemService } from '../services/itemService';
import AppNavbar from '../components/AppNavbar';
import { CATEGORIES } from '../constants/categories';

export default function UploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const { user, userId } = useUser();
  const { create } = useItems(userId);

  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    description: '',
    category: '',
    status: 'available',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (editId) fetchEditItem();
  }, [editId]);

  async function fetchEditItem() {
    try {
      setFetching(true);
      const item = await getItemByIdService(editId);
      setForm({
        title: item.title,
        price: item.price_per_day,
        location: item.location || '',
        description: item.description || '',
        category: item.category_name || '',
        status: item.status || 'available',
        image: item.image
      });
      setPreview(item.image);
    } catch (err) {
      setError("Gagal memuat data produk: " + err.message);
    } finally {
      setFetching(false);
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setForm(prev => ({ ...prev, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.price || !form.category) {
      setError("Nama, Harga, dan Kategori wajib diisi!");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editId) {
        await updateItemService(editId, userId, form);
        navigate(`/product/${editId}`);
      } else {
        await create(form);
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <AppNavbar />

      <main className="max-w-lg mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="rp-back-btn mb-6">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="rp-card overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b" style={{ borderColor: "#E8DCFF", background: "linear-gradient(135deg, #E8DCFF, #FFD6EC)" }}>
            <h1 className="text-lg font-black" style={{ color: "#3D2F6B" }}>
              {editId ? '✏️ Edit Produk' : '📦 Upload Produk Baru'}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#7B6AAA" }}>
              {editId ? 'Perbarui informasi barang yang Anda sewakan' : 'Sewakan barang kamu dan dapatkan penghasilan tambahan'}
            </p>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 rounded-full rp-skeleton" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mx-6 mt-4 rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: "#FFD6EC", color: "#9B4070", border: "1px solid #FFB3D9" }}>
                  {error}
                </div>
              )}

              {/* Image Upload */}
              <div className="p-5 border-b" style={{ borderColor: "#E8DCFF" }}>
                <label className="flex flex-col items-center justify-center w-full h-52 cursor-pointer rounded-2xl overflow-hidden relative transition-all"
                  style={{ border: "2px dashed #C9B8FF", background: "#FAF8FF" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#E8DCFF"}
                  onMouseLeave={e => e.currentTarget.style.background = "#FAF8FF"}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.3)" }}>
                        <span className="text-white font-bold text-sm">Ganti Foto</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={36} style={{ color: "#C9B8FF", marginBottom: 8 }} />
                      <span className="text-sm font-bold" style={{ color: "#9B87D9" }}>Tambah Foto Produk</span>
                      <span className="text-xs mt-1" style={{ color: "#A89CC4" }}>Format JPG/PNG, maks 4MB</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              </div>

              {/* Fields */}
              <div className="divide-y" style={{ borderColor: "#E8DCFF" }}>
                <div className="flex items-center gap-3 px-5 py-4">
                  <FileText size={18} style={{ color: "#C9B8FF", flexShrink: 0 }} />
                  <input
                    type="text" name="title" value={form.title} onChange={handleChange}
                    placeholder="Nama produk (cth: Kamera Sony A7III)"
                    className="flex-1 text-sm outline-none bg-transparent"
                    style={{ color: "#3D2F6B" }}
                  />
                </div>

                <div className="flex items-center gap-3 px-5 py-4">
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: "#C9B8FF" }}>Rp</span>
                  <input
                    type="number" name="price" value={form.price} onChange={handleChange}
                    placeholder="Harga sewa per hari" min="0"
                    className="flex-1 text-sm outline-none bg-transparent"
                    style={{ color: "#3D2F6B" }}
                  />
                </div>

                <div className="flex items-center gap-3 px-5 py-4">
                  <MapPin size={18} style={{ color: "#C9B8FF", flexShrink: 0 }} />
                  <input
                    type="text" name="location" value={form.location} onChange={handleChange}
                    placeholder="Lokasi produk (opsional)"
                    className="flex-1 text-sm outline-none bg-transparent"
                    style={{ color: "#3D2F6B" }}
                  />
                </div>

                <div className="flex gap-3 px-5 py-4">
                  <FileText size={18} style={{ color: "#C9B8FF", flexShrink: 0, marginTop: 2 }} />
                  <textarea
                    name="description" value={form.description} onChange={handleChange}
                    placeholder="Deskripsi produk (kondisi, spesifikasi, syarat sewa)"
                    rows={3}
                    className="flex-1 text-sm outline-none resize-none bg-transparent"
                    style={{ color: "#3D2F6B" }}
                  />
                </div>

                <div className="flex items-center gap-3 px-5 py-4">
                  <Tag size={18} style={{ color: "#C9B8FF", flexShrink: 0 }} />
                  <select
                    name="category" value={form.category} onChange={handleChange}
                    className="flex-1 text-sm outline-none bg-transparent"
                    style={{ color: form.category ? "#3D2F6B" : "#A89CC4" }}
                  >
                    <option value="">Pilih kategori...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ color: "#C9B8FF" }} />
                </div>

                <div className="flex items-center gap-3 px-5 py-4">
                  <Tag size={18} style={{ color: "#C9B8FF", flexShrink: 0 }} />
                  <select
                    name="status" value={form.status} onChange={handleChange}
                    className="flex-1 text-sm outline-none bg-transparent"
                    style={{ color: "#3D2F6B" }}
                  >
                    <option value="available">Tersedia</option>
                    <option value="rented">Sedang Disewa</option>
                  </select>
                  <ChevronDown size={16} style={{ color: "#C9B8FF" }} />
                </div>
              </div>

              <div className="p-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="rp-btn-primary w-full py-3.5 text-base"
                >
                  {saving ? (editId ? 'Menyimpan...' : 'Mengupload...') : (
                    <><Upload size={18} /> {editId ? 'Simpan Perubahan' : 'Upload Produk Sekarang'}</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
