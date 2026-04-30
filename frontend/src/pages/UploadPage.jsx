import React, { useState } from 'react';
import axios from 'axios';
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

      await axios.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Produk berhasil diupload! 🎉');
      setTimeout(() => { window.location.href = '/'; }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload gagal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="page-header">
          <h1 className="page-title">📤 Upload Produk</h1>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Foto Produk (maks. 5 foto)</label>

            {previews.length > 0 && (
              <div className="photo-preview-grid">
                {previews.map((url, i) => (
                  <div key={i} className="photo-preview-item">
                    <img src={url} alt={`preview-${i}`} />
                    <button
                      type="button"
                      className="photo-remove-btn"
                      onClick={() => removePhoto(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < 5 && (
              <label className="upload-photo-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
                <span style={{ fontSize: 32 }}>📷</span>
                <p style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>
                  Klik untuk pilih foto ({photos.length}/5)
                </p>
              </label>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategori</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Nama Produk</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Contoh: Kamera DSLR Canon 700D"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Harga Sewa per Hari (Rp)</label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Contoh: 150000"
              value={form.price}
              onChange={handleChange}
              min={0}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Lokasi</label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="Contoh: Bandung, Jawa Barat"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Deskripsi Produk</label>
            <textarea
              id="description"
              name="description"
              placeholder="Jelaskan kondisi produk, syarat sewa, dll."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 8, padding: '14px' }}
          >
            {loading ? 'Mengupload...' : '📤 Upload Produk'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;
