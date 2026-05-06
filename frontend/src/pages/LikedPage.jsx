import React, { useState, useEffect } from 'react';
import { getLikedProducts, toggleLike } from '../services/api';
import ProductCard from '../components/ProductCard';
import { getVisitorId } from '../utils/visitor';

function LikedPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiked() {
      try {
        const visitorId = getVisitorId();
        const res = await getLikedProducts({ visitorId });
        setProducts(res.data);
      } catch (err) {
        console.error('Gagal ambil liked products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiked();
  }, []);

  async function handleUnlike(productId) {
    try {
      const visitorId = getVisitorId();
      await toggleLike(productId, { visitorId });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Gagal unlike:', err);
    }
  }

  return (
    <div className="py-8 px-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-bold text-[#1a1a2e]">❤️ Produk yang Disukai</h1>
      </div>

      {loading ? (
        <div className="text-center p-15 text-gray-500 text-sm">Memuat...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-15 px-6 text-gray-400">
          <span className="text-5xl block mb-3">🤍</span>
          <p className="text-base mb-4">Belum ada produk yang disukai</p>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all border-none font-sans bg-[#1d6bcf] text-white hover:bg-[#155db8] no-underline mt-4"
          >
            Jelajahi Produk
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 mt-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              hideLikeCount={true}
              actionButton={
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[13px] transition-colors text-red-500 hover:bg-red-50"
                  onClick={(e) => { e.stopPropagation(); handleUnlike(product.id); }}
                  title="Hapus dari suka"
                >
                  ❤️ Batal Suka
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LikedPage;
