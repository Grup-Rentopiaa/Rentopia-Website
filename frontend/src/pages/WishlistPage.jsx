import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Trash2, Search, Package } from 'lucide-react';
import { getLikedItemsService, clearLikedItemsService, likeItemService } from '../services/itemService';
import AppNavbar from '../components/AppNavbar';

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

export default function WishlistPage() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || 'null');
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (user) fetchItems();
    else setLoading(false);
  }, []);

  useEffect(() => {
    const handler = () => fetchItems();
    window.addEventListener('likeChanged', handler);
    return () => window.removeEventListener('likeChanged', handler);
  }, []);

  async function fetchItems() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getLikedItemsService(user.id);
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }

  async function handleRemoveItem(id) {
    const wishlistKey = `rentopia_wishlist_${user.id}`;
    const existing = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
    localStorage.setItem(wishlistKey, JSON.stringify(existing.filter(x => x !== id)));
    setItems(prev => prev.filter(i => i.id !== id));
    window.dispatchEvent(new CustomEvent('likeChanged'));
    try { await likeItemService(id, user.id); } catch {}
  }

  async function handleClearAll() {
    if (!window.confirm("Hapus semua item dari wishlist?")) return;
    setClearing(true);
    try {
      await clearLikedItemsService(user.id);
      localStorage.removeItem(`rentopia_wishlist_${user.id}`);
      setItems([]);
      window.dispatchEvent(new CustomEvent('likeChanged'));
    } catch {} finally { setClearing(false); }
  }

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  const wishlistCount = items.length;

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <AppNavbar wishlistCount={wishlistCount} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="rp-back-btn">
            <ArrowLeft size={16} /> Kembali
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-black" style={{ color: "#3D2F6B" }}>
              <Heart size={22} className="inline mr-2" style={{ color: "#FFB3D9" }} />
              Wishlist Saya
            </h1>
            <p className="text-sm" style={{ color: "#A89CC4" }}>{items.length} produk tersimpan</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={clearing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              style={{ background: "#FFD6EC", color: "#9B4070" }}
            >
              <Trash2 size={14} />
              {clearing ? "Menghapus..." : "Hapus Semua"}
            </button>
          )}
        </div>

        {/* Search */}
        {items.length > 0 && (
          <div className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#C9B8FF" }} />
            <input
              type="text"
              placeholder="Cari di wishlist..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rp-input pl-10"
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="rp-card overflow-hidden">
                <div className="rp-skeleton aspect-square w-full" />
                <div className="p-3 space-y-2">
                  <div className="rp-skeleton h-4 w-3/4" />
                  <div className="rp-skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rp-card py-20 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4" style={{ background: "#FFD6EC" }}>
              💝
            </div>
            <h3 className="font-black text-xl mb-2" style={{ color: "#3D2F6B" }}>Wishlist Masih Kosong</h3>
            <p className="mb-6" style={{ color: "#A89CC4" }}>Suka produk? Tap ikon ❤️ untuk menyimpannya di sini.</p>
            <button onClick={() => navigate('/home')} className="rp-btn-primary">
              Jelajahi Produk
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rp-card py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-bold" style={{ color: "#3D2F6B" }}>Tidak ditemukan</p>
            <button onClick={() => setSearch('')} className="rp-btn-outline mt-4 text-sm">Reset</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="rp-product-card group relative">
                <div
                  className="relative aspect-square overflow-hidden cursor-pointer"
                  style={{ background: "#E8DCFF" }}
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold line-clamp-2 mb-1" style={{ color: "#3D2F6B" }}
                    onClick={() => navigate(`/product/${item.id}`)}>{item.title}</h3>
                  <p className="font-black text-sm" style={{ color: "#9B87D9" }}>
                    {formatPrice(item.price_per_day || item.price)}
                    <span className="font-normal text-xs" style={{ color: "#A89CC4" }}>/hari</span>
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
                    style={{ background: "#FFD6EC", color: "#9B4070" }}
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
