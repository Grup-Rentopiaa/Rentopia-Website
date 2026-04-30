import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getVisitorId } from '../utils/visitor';

const IMG_BASE = 'http://localhost:5000/uploads/';

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function StatsPage() {
  const [products, setProducts] = useState([]);
  const [statsMap, setStatsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const visitorId = getVisitorId();
      const res = await axios.get('/api/products/my', { params: { visitorId } });
      setProducts(res.data);

      const stats = {};
      for (const product of res.data) {
        try {
          const statRes = await axios.get(`/api/stats/${product.id}`, { params: { visitorId } });
          stats[product.id] = statRes.data;
        } catch {
          stats[product.id] = { total_views: 0, total_likes: 0 };
        }
      }
      setStatsMap(stats);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini? Foto dan statistik juga akan terhapus.')) {
      try {
        const visitorId = getVisitorId();
        await axios.delete(`/api/products/${id}`, { params: { visitorId } });
        setProducts(products.filter(p => p.id !== id));
        alert('Produk berhasil dihapus');
      } catch (err) {
        alert('Gagal menghapus produk');
      }
    }
  };

  const handleEditClick = (product) => {
    setCurrentProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const visitorId = getVisitorId();
      await axios.put(`/api/products/${currentProduct.id}`, { ...currentProduct, visitorId });

      alert('Produk berhasil diperbarui');
      setIsEditModalOpen(false);
      fetchData(); 
    } catch (err) {
      console.error("Error detail:", err.response?.data); 
      alert(err.response?.data?.message || 'Gagal memperbarui produk');
    }
  };

  const totalViews = Object.values(statsMap).reduce((sum, s) => sum + (s.total_views || 0), 0);
  const totalLikes = Object.values(statsMap).reduce((sum, s) => sum + (s.total_likes || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📊 Statistik Produkku</h1>
      </div>

      {loading ? (
        <div className="spinner">Memuat statistik...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>Belum ada produk.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
            <div className="stat-box">
              <div className="stat-box-number">{products.length}</div>
              <div className="stat-box-label">📦 Total Produk</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-number">{totalViews}</div>
              <div className="stat-box-label">👁 Total Dilihat</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-number">{totalLikes}</div>
              <div className="stat-box-label">❤️ Total Suka</div>
            </div>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Detail per Produk</h2>

          {products.map((product) => {
            const stat = statsMap[product.id] || { total_views: 0, total_likes: 0 };
            return (
              <div className="stats-card" key={product.id}>
                <div className="stats-card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {product.first_photo ? (
                      <img src={IMG_BASE + product.first_photo} alt={product.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }} />
                    ) : (
                      <div className="placeholder">📦</div>
                    )}
                    <div>
                      <div className="stats-card-product-name">{product.name}</div>
                      <div className="stats-card-product-price">{formatRupiah(product.price)}/hari</div>

                      <div style={{
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: product.status === 'tersedia' ? '#16a34a' : '#dc2626',
                        marginTop: 4
                      }}>
                        ● {product.status === 'tersedia' ? 'Tersedia' : 'Sudah Disewa'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => handleEditClick(product)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(product.id)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}>🗑️ Hapus</button>
                  </div>
                </div>

                <div className="stats-numbers" style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  <span>👁 {stat.total_views} Views</span>
                  <span>❤️ {stat.total_likes} Likes</span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleUpdateProduct} style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, width: '90%', maxWidth: 450, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: 20, textAlign: 'center' }}>Edit Produk</h3>

            <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Kategori</label>
            <select value={currentProduct?.category || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })} style={{ width: '100%', marginBottom: 16, padding: '10px', borderRadius: 6, border: '1px solid #ccc' }} required >
              <option value="">Pilih Kategori</option>
              <option value="Kamera">Kamera</option>
              <option value="Pakaian">Pakaian</option>
              <option value="Alat Olahraga">Alat Olahraga</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Nama Produk</label>
            <input type="text" value={currentProduct?.name || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} style={{ width: '100%', marginBottom: 16, padding: '10px', borderRadius: 6, border: '1px solid #ccc' }} required />

            <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Harga per Hari (Rp)</label>
            <input type="number" value={currentProduct?.price || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })} style={{ width: '100%', marginBottom: 16, padding: '10px', borderRadius: 6, border: '1px solid #ccc' }} required />

            <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Lokasi</label>
            <input type="text" value={currentProduct?.location || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, location: e.target.value })} style={{ width: '100%', marginBottom: 16, padding: '10px', borderRadius: 6, border: '1px solid #ccc' }} required />

            <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Deskripsi Produk</label>
            <textarea value={currentProduct?.description || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })} style={{ width: '100%', marginBottom: 20, padding: '10px', borderRadius: 6, border: '1px solid #ccc', minHeight: 80, fontFamily: 'inherit' }} />

            <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Status Ketersediaan</label>

            <select
              value={currentProduct?.status || 'tersedia'}
              onChange={(e) => setCurrentProduct({ ...currentProduct, status: e.target.value })}
              style={{ width: '100%', marginBottom: 20, padding: '10px', borderRadius: 6, border: '1px solid #ccc', backgroundColor: 'white' }}
            >
              <option value="tersedia">✅ Tersedia</option>
              <option value="tidak tersedia">❌ Tidak Tersedia (Sedang Disewa)</option>
            </select>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 20px', borderRadius: 6, border: '1px solid #ccc', cursor: 'pointer', background: 'none' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', borderRadius: 6, border: 'none', backgroundColor: '#4F46E5', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Simpan Perubahan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default StatsPage;