import React, { useState } from 'react';
import { uploadProduct } from '../services/api';
import { getVisitorId } from '../utils/visitor';

const CATEGORIES = [
  'Elektronik',
  'Kendaraan',
  'Peralatan Rumah',
  'Pakaian & Kostum',
  'Alat Musik',
  'Olahraga',
  'Kamera & Foto',
  'Buku & Peralatan Belajar',
  'Perlengkapan Bayi',
  'Lainnya',
];

function UploadPage() {
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    location: '',
    description: '',
  });
  const [photos, setPhotos] = useState([]); 
  const [previews, setPreviews] = useState([]); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePhotoChange(e) {
    const files = Array.from(e.target.files);

    const remaining = 5 - photos.length;
    const newFiles = files.slice(0, remaining);

    if (files.length > remaining) {
      setError(`Maksimal 5 foto. ${files.length - remaining} foto diabaikan.`);
    }

    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPhotos([...photos, ...newFiles]);
    setPreviews([...previews, ...newPreviews]);
  }

  function removePhoto(index) {
    URL.revokeObjectURL(previews[index]); 
    setPhotos(photos.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const visitorId = getVisitorId();
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('location', form.location);
      formData.append('description', form.description);
      formData.append('visitorId', visitorId);
      photos.forEach((photo) => formData.append('photos', photo));

      await uploadProduct(formData);

      setSuccess('Produk berhasil diupload! 🎉');
      setTimeout(() => { window.location.href = '/'; }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload gagal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8 px-6 max-w-[1200px] mx-auto">
      <div className="max-w-[600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-bold text-[#1a1a2e]">📤 Upload Produk</h1>
        </div>

        {error && <div className="bg-red-50 text-red-600 px-3.5 py-2.5 rounded-lg text-sm mb-4">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 px-3.5 py-2.5 rounded-lg text-sm mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4.5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto Produk (maks. 5 foto)</label>

            {previews.length > 0 && (
              <div className="grid grid-cols-5 gap-2.5 mb-4.5">
                {previews.map((url, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden aspect-square">
                    <img src={url} alt={`preview-${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/60 text-white border-none rounded-full w-[22px] h-[22px] cursor-pointer text-xs flex items-center justify-center"
                      onClick={() => removePhoto(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < 5 && (
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-50 hover:border-blue-600 hover:bg-blue-50 mb-4.5 block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <span className="text-[32px]">📷</span>
                <p className="mt-2 text-sm text-gray-500">
                  Klik untuk pilih foto ({photos.length}/5)
                </p>
              </label>
            )}
          </div>

          <div className="mb-4.5">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-300 rounded-lg text-sm font-sans bg-white outline-none transition-colors focus:border-[#1d6bcf] focus:ring-[3px] focus:ring-[#1d6bcf]/10"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="mb-4.5">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Nama Produk</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Contoh: Kamera DSLR Canon 700D"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-300 rounded-lg text-sm font-sans bg-white outline-none transition-colors focus:border-[#1d6bcf] focus:ring-[3px] focus:ring-[#1d6bcf]/10"
              required
            />
          </div>

          <div className="mb-4.5">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">Harga Sewa per Hari (Rp)</label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Contoh: 150000"
              value={form.price}
              onChange={handleChange}
              min={0}
              className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-300 rounded-lg text-sm font-sans bg-white outline-none transition-colors focus:border-[#1d6bcf] focus:ring-[3px] focus:ring-[#1d6bcf]/10"
              required
            />
          </div>

          <div className="mb-4.5">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">Lokasi</label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="Contoh: Bandung, Jawa Barat"
              value={form.location}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-300 rounded-lg text-sm font-sans bg-white outline-none transition-colors focus:border-[#1d6bcf] focus:ring-[3px] focus:ring-[#1d6bcf]/10"
              required
            />
          </div>

          <div className="mb-4.5">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Produk</label>
            <textarea
              id="description"
              name="description"
              placeholder="Jelaskan kondisi produk, syarat sewa, dll."
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-300 rounded-lg text-sm font-sans bg-white outline-none transition-colors focus:border-[#1d6bcf] focus:ring-[3px] focus:ring-[#1d6bcf]/10 resize-y min-h-[100px]"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 mt-2 bg-[#1d6bcf] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-[#155db8] disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Mengupload...' : '📤 Upload Produk'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;
