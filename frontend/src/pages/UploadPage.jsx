import { Upload, ImagePlus, Tag, MapPin, FileText, ChevronRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../hooks/useItems';
import { useUser } from '../hooks/useUser';

export default function UploadPage() {
  const navigate = useNavigate();
  const { user, userId } = useUser();
  const { create } = useItems(userId);
  
  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    description: '',
    category: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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
      await create(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-xl items-center px-6 py-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft size={18} />
            Batal
          </button>
          <div className="flex-1 text-center font-bold text-slate-900">Upload Produk</div>
          <div className="w-[70px]"></div> {/* spacer */}
        </div>
      </nav>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Sewakan barang kamu dan dapatkan penghasilan tambahan</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-500 font-semibold">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Upload foto */}
          <div className="p-5 border-b border-gray-100 relative">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors overflow-hidden relative">
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-semibold text-sm">Ganti Foto</span>
                  </div>
                </>
              ) : (
                <>
                  <ImagePlus size={32} className="text-blue-400 mb-2" />
                  <span className="text-sm font-medium text-blue-600">Tambah Foto Produk</span>
                  <span className="text-xs text-gray-400 mt-1">Format JPG/PNG</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="flex items-center gap-3 px-5 py-4">
              <FileText size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Nama produk (mis: Kamera Sony A7III)"
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-3 px-5 py-4">
              <Tag size={18} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-400 flex-shrink-0">Rp</span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Harga sewa per hari"
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none"
                min="0"
              />
            </div>

            <div className="flex items-center gap-3 px-5 py-4">
              <MapPin size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Lokasi produk (opsional)"
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none"
              />
            </div>

            <div className="flex gap-3 px-5 py-4">
              <FileText size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Deskripsi produk (kondisi, spesifikasi, syarat sewa)"
                rows={3}
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-3 px-5 py-4">
              <Tag size={18} className="text-gray-400 flex-shrink-0" />
              <select name="category" value={form.category} onChange={handleChange} className="flex-1 text-sm text-gray-700 outline-none bg-transparent">
                <option value="">Pilih kategori...</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Kendaraan">Kendaraan</option>
                <option value="Pakaian">Pakaian</option>
                <option value="Peralatan Rumah">Peralatan Rumah</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Kamera & Fotografi">Kamera & Fotografi</option>
                <option value="Alat Musik">Alat Musik</option>
                <option value="Buku & Pendidikan">Buku & Pendidikan</option>
                <option value="Bayi & Anak">Bayi & Anak</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md">
          {saving ? 'Mengupload...' : (
            <>
              <Upload size={18} />
              Upload Produk Sekarang
            </>
          )}
        </button>
      </form>
    </div>
  );
}
