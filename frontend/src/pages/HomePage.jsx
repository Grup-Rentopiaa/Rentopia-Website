import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, getLikedProducts, toggleLike, getProductDetail } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { getVisitorId } from '../utils/visitor';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? { search } : {};
      const res = await getProducts(params);
      setProducts(res.data);
    } catch (err) {
      console.error('Gagal ambil produk:', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const fetchLikes = useCallback(async () => {
    try {
      const visitorId = getVisitorId();
      const res = await getLikedProducts({ visitorId });
      setLikedIds(new Set(res.data.map((p) => p.id)));
    } catch (err) {
      console.error('Gagal ambil likes:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchLikes();
  }, [fetchProducts, fetchLikes]);

  async function handleLikeToggle(productId) {
    try {
      const visitorId = getVisitorId();
      const res = await toggleLike(productId, { visitorId });
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (res.data.liked) {
          next.add(productId);
        } else {
          next.delete(productId);
        }
        return next;
      });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, like_count: res.data.liked ? Number(p.like_count) + 1 : Number(p.like_count) - 1 }
            : p
        )
      );
    } catch (err) {
      console.error('Gagal toggle like:', err);
    }
  }

  async function handleCardClick(product) {
    try {
      const visitorId = getVisitorId();
      const res = await getProductDetail(product.id, { visitorId });
      setSelectedProduct(res.data);
    } catch (err) {
      setSelectedProduct(product);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
  }

  return (
    <div className="py-8 px-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-bold text-[#1a1a2e]">🏠 Semua Produk Sewa</h1>
        <a href="/upload" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all border-none font-sans bg-[#1d6bcf] text-white hover:bg-[#155db8] no-underline">
          📤 Upload Produk
        </a>
      </div>

      <form className="flex gap-2 mb-1" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Cari produk (nama atau kategori)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 px-4 py-2.5 border-[1.5px] border-gray-300 rounded-lg text-sm font-sans outline-none transition-colors focus:border-[#1d6bcf] focus:ring-[3px] focus:ring-[#1d6bcf]/10"
        />
        <button type="submit" className="px-5 py-2.5 bg-[#1d6bcf] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-[#155db8]">🔍 Cari</button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); setSearchInput(''); }}
            className="px-5 py-2.5 bg-gray-500 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-gray-600"
          >
            ✕ Reset
          </button>
        )}
      </form>

      {search && (
        <p className="text-[13px] text-gray-500 mb-2">
          Hasil pencarian: "{search}"
        </p>
      )}

      {loading ? (
        <div className="text-center p-15 text-gray-500 text-sm">Memuat produk...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-15 px-6 text-gray-400">
          <span className="text-5xl block mb-3">📦</span>
          <p className="text-base">{search ? 'Produk tidak ditemukan' : 'Belum ada produk. Jadilah yang pertama upload!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 mt-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLiked={likedIds.has(product.id)}
              onLikeToggle={handleLikeToggle}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isLiked={likedIds.has(selectedProduct.id)}
          onLikeToggle={handleLikeToggle}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
