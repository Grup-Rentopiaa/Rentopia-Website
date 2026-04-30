import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getVisitorId } from '../utils/visitor';

const IMG_BASE = 'http://localhost:5000/uploads/';

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function ProductCard({ product, onLikeToggle, isLiked, onCardClick }) {
  return (
    <div className="product-card" onClick={() => onCardClick(product)}>
      {product.first_photo ? (
        <img
          className="product-card-img"
          src={IMG_BASE + product.first_photo}
          alt={product.name}
        />
      ) : (
        <div className="product-card-img-placeholder">📦</div>
      )}

      <div className="product-card-body">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price">{formatRupiah(product.price)}/hari</div>
        <div className="product-card-location">📍 {product.location}</div>

        <div style={{ 
          fontSize: '11px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: (product.status === 'tidak tersedia' || product.status === 'sudah disewa') ? '#dc2626' : '#16a34a'        }}>
          ● {(product.status === 'tidak tersedia' || product.status === 'sudah disewa') ? 'Sudah Disewa' : 'Tersedia'}        </div>

        <span className="badge">{product.category}</span>

        <div className="product-card-footer">
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
            👁 {product.view_count} dilihat
          </span>
          <button
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle(product.id);
            }}
          >
            {isLiked ? '❤️' : '🤍'} {product.like_count}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, isLiked, onLikeToggle, onClose }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!product) return null;

  const photos = product.photos || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontWeight: 600, fontSize: '16px' }}>{product.name}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {photos.length > 0 ? (
            <>
              <div className="photo-slider">
                <img src={IMG_BASE + photos[photoIndex]} alt={product.name} />
              </div>
              {photos.length > 1 && (
                <div className="photo-nav">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      className={`photo-dot ${i === photoIndex ? 'active' : ''}`}
                      onClick={() => setPhotoIndex(i)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                height: 200,
                background: '#f3f4f6',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                marginBottom: 16,
              }}
            >
              📦
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1d6bcf' }}>
              {formatRupiah(product.price)}/hari
            </span>
            <button
              className={`like-btn ${isLiked ? 'liked' : ''}`}
              onClick={() => onLikeToggle(product.id)}
              style={{ fontSize: 16 }}
            >
              {isLiked ? '❤️' : '🤍'} Suka
            </button>
          </div>

          <div style={{ marginBottom: 12 }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: product.status === 'tersedia' ? '#dcfce7' : '#fee2e2',
              color: product.status === 'tersedia' ? '#166534' : '#991b1b',
              border: `1px solid ${product.status === 'tersedia' ? '#bbf7d0' : '#fecaca'}`
           }}>
             {product.status === 'tersedia' ? '🟢 Tersedia' : '🔴 Sudah Disewa'}
            </span>
          </div>

          <div style={{ marginBottom: 8 }}>
            <span className="badge">{product.category}</span>
          </div>

          <p style={{ fontSize: 13, color: '#6b7280', margin: '8px 0' }}>
            📍 {product.location}
          </p>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
            👁 {product.view_count} dilihat • ❤️ {product.like_count} suka
          </p>

          {product.description && (
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
              {product.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

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
      const res = await axios.get('/api/products', { params });
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
      const res = await axios.get('/api/likes', { params: { visitorId } });
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
      const res = await axios.post(`/api/likes/${productId}`, { visitorId });
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
      const res = await axios.get(`/api/products/${product.id}`, { params: { visitorId } });
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
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🏠 Semua Produk Sewa</h1>
        <a href="/upload.html" className="btn btn-primary">
          📤 Upload Produk
        </a>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Cari produk (nama atau kategori)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">🔍 Cari</button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); setSearchInput(''); }}
            style={{ background: '#6b7280' }}
          >
            ✕ Reset
          </button>
        )}
      </form>

      {search && (
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
          Hasil pencarian: "{search}"
        </p>
      )}

      {loading ? (
        <div className="spinner">Memuat produk...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <span>📦</span>
          <p>{search ? 'Produk tidak ditemukan' : 'Belum ada produk. Jadilah yang pertama upload!'}</p>
        </div>
      ) : (
        <div className="product-grid">
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
