import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getVisitorId } from '../utils/visitor';

const IMG_BASE = 'http://localhost:5000/uploads/';

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function LikedPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiked() {
      try {
        const visitorId = getVisitorId();
        const res = await axios.get('/api/likes', { params: { visitorId } });
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
      await axios.post(`/api/likes/${productId}`, { visitorId });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Gagal unlike:', err);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">❤️ Produk yang Disukai</h1>
      </div>

      {loading ? (
        <div className="spinner">Memuat...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <span>🤍</span>
          <p>Belum ada produk yang disukai</p>
          <a
            href="/"
            className="btn btn-primary"
            style={{ marginTop: 16 }}
          >
            Jelajahi Produk
          </a>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
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
                <span className="badge">{product.category}</span>

                <div className="product-card-footer">
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>
                    👁 {product.view_count} dilihat
                  </span>
                  <button
                    className="like-btn liked"
                    onClick={() => handleUnlike(product.id)}
                    title="Hapus dari suka"
                  >
                    ❤️ Batal Suka
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LikedPage;
