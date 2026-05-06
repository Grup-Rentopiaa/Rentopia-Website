import React, { useState, useEffect } from 'react';
import { getMyProducts, getProductStats, deleteProduct, updateProduct } from '../services/api';
import { formatRupiah } from '../utils/format';
import { getVisitorId } from '../utils/visitor';

const IMG_BASE = 'http://localhost:5000/uploads/';

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
      const res = await getMyProducts({ visitorId });
      setProducts(res.data);

      const stats = {};
      for (const product of res.data) {
        try {
          const statRes = await getProductStats(product.id, { visitorId });
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
        await deleteProduct(id, { visitorId });
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
      await updateProduct(currentProduct.id, { ...currentProduct, visitorId });

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
    <div className="py-8 px-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-bold text-[#1a1a2e]">📊 Statistik Produkku</h1>
      </div>

      {loading ? (
        <div className="text-center p-15 text-gray-500 text-sm">Memuat statistik...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-15 px-6 text-gray-400">
          <p>Belum ada produk.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="bg-[#f4f7fb] rounded-xl p-4.5 text-center">
              <div className="text-[32px] font-bold text-[#1d6bcf]">{products.length}</div>
              <div className="text-[13px] text-gray-500 mt-1">📦 Total Produk</div>
            </div>
            <div className="bg-[#f4f7fb] rounded-xl p-4.5 text-center">
              <div className="text-[32px] font-bold text-[#1d6bcf]">{totalViews}</div>
              <div className="text-[13px] text-gray-500 mt-1">👁 Total Dilihat</div>
            </div>
            <div className="bg-[#f4f7fb] rounded-xl p-4.5 text-center">
              <div className="text-[32px] font-bold text-[#1d6bcf]">{totalLikes}</div>
              <div className="text-[13px] text-gray-500 mt-1">❤️ Total Suka</div>
            </div>
          </div>

          <h2 className="text-base font-semibold mb-4">Detail per Produk</h2>

          {products.map((product) => {
            const stat = statsMap[product.id] || { total_views: 0, total_likes: 0 };
            return (
              <div className="bg-white rounded-xl p-6 shadow-sm mb-4" key={product.id}>
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
                  <div className="flex gap-3">
                    {product.first_photo ? (
                      <img src={IMG_BASE + product.first_photo} alt={product.name} className="w-14 h-14 rounded-lg object-cover bg-gray-100" />
                    ) : (
                      <div className="w-14 h-14 bg-blue-50 flex items-center justify-center text-xl rounded-lg">📦</div>
                    )}
                    <div>
                      <div className="font-semibold text-base">{product.name}</div>
                      <div className="text-[#1d6bcf] text-sm font-semibold">{formatRupiah(product.price)}/hari</div>

                      <div className={`text-[11px] font-bold mt-1 ${product.status === 'tersedia' ? 'text-green-600' : 'text-red-600'}`}>
                        ● {product.status === 'tersedia' ? 'Tersedia' : 'Sudah Disewa'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <button onClick={() => handleEditClick(product)} className="px-3 py-1.5 rounded-md border border-gray-300 cursor-pointer bg-white hover:bg-gray-50 text-sm">✏️ Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="px-3 py-1.5 rounded-md border-none bg-red-100 text-red-600 cursor-pointer hover:bg-red-200 text-sm">🗑️ Hapus</button>
                  </div>
                </div>

                <div className="flex gap-4 mt-3">
                  <span className="text-sm">👁 {stat.total_views} Views</span>
                  <span className="text-sm">❤️ {stat.total_likes} Likes</span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <form onSubmit={handleUpdateProduct} className="bg-white p-6 rounded-xl w-full max-w-[450px] shadow-2xl">
            <h3 className="mb-5 text-center font-bold text-lg">Edit Produk</h3>

            <label className="font-semibold block mb-1 text-sm">Kategori</label>
            <select value={currentProduct?.category || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })} className="w-full mb-4 p-2.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-blue-500" required>
              <option value="">Pilih Kategori</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Kendaraan">Kendaraan</option>
              <option value="Peralatan Rumah">Peralatan Rumah</option>
              <option value="Pakaian & Kostum">Pakaian & Kostum</option>
              <option value="Alat Musik">Alat Musik</option>
              <option value="Olahraga">Olahraga</option>
              <option value="Kamera & Foto">Kamera & Foto</option>
              <option value="Buku & Peralatan Belajar">Buku & Peralatan Belajar</option>
              <option value="Perlengkapan Bayi">Perlengkapan Bayi</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            <label className="font-semibold block mb-1 text-sm">Nama Produk</label>
            <input type="text" value={currentProduct?.name || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} className="w-full mb-4 p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" required />

            <label className="font-semibold block mb-1 text-sm">Harga per Hari (Rp)</label>
            <input type="number" value={currentProduct?.price || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })} className="w-full mb-4 p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" required />

            <label className="font-semibold block mb-1 text-sm">Lokasi</label>
            <input type="text" value={currentProduct?.location || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, location: e.target.value })} className="w-full mb-4 p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" required />

            <label className="font-semibold block mb-1 text-sm">Deskripsi Produk</label>
            <textarea value={currentProduct?.description || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })} className="w-full mb-5 p-2.5 rounded-md border border-gray-300 min-h-[80px] focus:outline-none focus:border-blue-500" />

            <label className="font-semibold block mb-1 text-sm">Status Ketersediaan</label>
            <select
              value={currentProduct?.status || 'tersedia'}
              onChange={(e) => setCurrentProduct({ ...currentProduct, status: e.target.value })}
              className="w-full mb-5 p-2.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="tersedia">✅ Tersedia</option>
              <option value="tidak tersedia">❌ Tidak Tersedia (Sedang Disewa)</option>
            </select>

            <div className="flex gap-2.5 justify-end">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-md border border-gray-300 cursor-pointer bg-white hover:bg-gray-50">Batal</button>
              <button type="submit" className="px-5 py-2.5 rounded-md border-none bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default StatsPage;