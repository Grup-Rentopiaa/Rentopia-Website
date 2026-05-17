import { useState, useEffect } from 'react';
import { MapPin, Users, TrendingUp, Grid, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../api';
import useProducts from '../hooks/useProducts';
import AppNavbar from '../components/AppNavbar';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../constants/categories';

const RECOMMEND_TABS = [
  { id: 'semua',    label: 'Semua',    icon: <Grid size={14} /> },
  { id: 'trending', label: 'Trending',  icon: <TrendingUp size={14} /> },
  { id: 'terdekat', label: 'Terdekat', icon: <MapPin size={14} /> },
  { id: 'diikuti',  label: 'Diikuti',  icon: <Users size={14} /> },
];

const BANNERS = [
  { gradient: "linear-gradient(135deg, #E8DCFF, #FFD6EC)", emoji: "🏕️", title: "Musim Camping Tiba!", sub: "Sewa alat camping premium mulai Rp50rb/hari", category: "Camping & Outdoor" },
  { gradient: "linear-gradient(135deg, #D6F0FF, #C9EFDC)",  emoji: "📷", title: "Weekend Photo Session?", sub: "Kamera DSLR & mirrorless tersedia di kotamu", category: "Kamera & Foto" },
  { gradient: "linear-gradient(135deg, #FFD6EC, #E8DCFF)", emoji: "🎮", title: "Gaming Event Seru?", sub: "Sewa console & aksesori gaming terlengkap", category: "Elektronik" },
];

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();
  const [search, setSearch]             = useState('');
  const [category, setCategory]         = useState('');
  const [recommendTab, setRecommendTab] = useState('semua');
  const [showFilter, setShowFilter]     = useState(false);
  const [filter, setFilter]             = useState({ sort: 'random', minPrice: '', maxPrice: '' });
  const [bannerIdx, setBannerIdx]       = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Following feed state
  const [followingItems, setFollowingItems]   = useState([]);
  const [followingLoading, setFollowingLoading] = useState(false);

  const { items, loading } = useProducts(search, category, filter, user?.id);

  // Carousel auto-rotate
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Sync recommendTab with filter
  useEffect(() => {
    if (recommendTab === 'semua')    setFilter(prev => ({ ...prev, sort: 'random',   filter: null }));
    if (recommendTab === 'trending') setFilter(prev => ({ ...prev, sort: 'trending', filter: null }));
    if (recommendTab === 'terdekat') setFilter(prev => ({ ...prev, sort: 'nearest',  filter: null }));
  }, [recommendTab]);

  // Load following feed
  useEffect(() => {
    if (recommendTab !== 'diikuti' || !user?.id) return;
    setFollowingLoading(true);
    apiFetch(`/api/feed/following/${user.id}`)
      .then(data => setFollowingItems(Array.isArray(data) ? data : []))
      .catch(() => setFollowingItems([]))
      .finally(() => setFollowingLoading(false));
  }, [recommendTab, user?.id]);

  // Wishlist count
  useEffect(() => {
    function countWishlist() {
      if (!user) return;
      const list = JSON.parse(localStorage.getItem(`rentopia_wishlist_${user.id}`) || '[]');
      setWishlistCount(list.length);
    }
    countWishlist();
    window.addEventListener('likeChanged', countWishlist);
    return () => window.removeEventListener('likeChanged', countWishlist);
  }, []);

  const banner = BANNERS[bannerIdx];

  function handleSearchSubmit(value) {
    setSearch(value);
  }

  const displayItems = recommendTab === 'diikuti' ? followingItems : items;
  const displayLoading = recommendTab === 'diikuti' ? followingLoading : loading;

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <AppNavbar
        wishlistCount={wishlistCount}
        onSearch={setSearch}
        searchValue={search}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="max-w-7xl mx-auto px-4 pb-12">
        {/* ── Greeting ── */}
        <div className="pt-6 pb-4">
          <h1 className="text-2xl font-black" style={{ color: "#3D2F6B" }}>
            Halo, {user?.username || "Pengguna"}! 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A89CC4" }}>Mau sewa apa hari ini?</p>
        </div>

        {/* ── Hero Banner Carousel ── */}
        <div className="rounded-3xl overflow-hidden mb-6 relative" style={{ background: banner.gradient, minHeight: "160px" }}>
          <div className="p-8 flex items-center gap-6">
            <div className="flex-1">
              <p className="text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: "#9B87D9" }}>Promosi Spesial</p>
              <h2 className="text-xl font-black mb-1" style={{ color: "#3D2F6B" }}>{banner.title}</h2>
              <p className="text-sm" style={{ color: "#7B6AAA" }}>{banner.sub}</p>
              <button
                id={`banner-lihat-semua-${bannerIdx}`}
                onClick={() => navigate(`/products?category=${encodeURIComponent(banner.category)}`)}
                className="rp-btn-primary text-sm mt-4 px-5 py-2"
              >
                Lihat Semua
              </button>
            </div>
            <div className="text-6xl flex-shrink-0 hidden sm:block">{banner.emoji}</div>
          </div>
          {/* Dots */}
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {BANNERS.map((_, i) => (
              <button key={i} onClick={() => setBannerIdx(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === bannerIdx ? "#9B87D9" : "#C9B8FF" }}
              />
            ))}
          </div>
        </div>

        {/* ── Categories ── */}
        <div className="mb-6 flex gap-2 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setCategory("")}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all"
            style={{
              background: !category ? "linear-gradient(135deg, #C9B8FF, #B09FEF)" : "#FFFFFF",
              color: !category ? "#3D2F6B" : "#A89CC4",
              border: !category ? "none" : "1px solid #E8DCFF"
            }}
          >
            Semua
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? "" : cat)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all border"
              style={{
                background: category === cat ? "linear-gradient(135deg, #C9B8FF, #B09FEF)" : "#FFFFFF",
                color: category === cat ? "#3D2F6B" : "#A89CC4",
                borderColor: category === cat ? "transparent" : "#E8DCFF"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Filter Tabs + Filter button ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {RECOMMEND_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setRecommendTab(tab.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all"
                style={{
                  background: recommendTab === tab.id ? "#E8DCFF" : "transparent",
                  color: recommendTab === tab.id ? "#9B87D9" : "#A89CC4"
                }}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilter(v => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background: showFilter ? "#E8DCFF" : "#FFFFFF", color: "#9B87D9", border: "1px solid #E8DCFF" }}
          >
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>

        {/* ── Filter Panel ── */}
        {showFilter && (
          <div className="rp-card p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm" style={{ color: "#3D2F6B" }}>Filter &amp; Urutkan</h3>
              <button onClick={() => setShowFilter(false)}><X size={16} style={{ color: "#A89CC4" }} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>Harga Min (Rp)</label>
                <input type="number" value={filter.minPrice} onChange={e => setFilter(p => ({ ...p, minPrice: e.target.value }))}
                  placeholder="0" className="rp-input text-sm py-2" />
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>Harga Max (Rp)</label>
                <input type="number" value={filter.maxPrice} onChange={e => setFilter(p => ({ ...p, maxPrice: e.target.value }))}
                  placeholder="∞" className="rp-input text-sm py-2" />
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>Urutkan</label>
                <select value={filter.sort} onChange={e => setFilter(p => ({ ...p, sort: e.target.value }))} className="rp-input text-sm py-2">
                  <option value="random">Default</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
                  <option value="trending">Paling Populer</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setFilter({ sort: 'random', minPrice: '', maxPrice: '' })} className="rp-btn-outline text-sm py-2 flex-1">Reset</button>
              <button onClick={() => setShowFilter(false)} className="rp-btn-primary text-sm py-2 flex-1">Terapkan</button>
            </div>
          </div>
        )}

        {/* ── Product Grid ── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-lg" style={{ color: "#3D2F6B" }}>
            {search ? `Hasil "${search}"` : category ? category : "Semua Produk"}
          </h2>
          {!displayLoading && <span className="text-sm font-semibold" style={{ color: "#A89CC4" }}>{displayItems.length} barang</span>}
        </div>

        {/* Diikuti empty state */}
        {recommendTab === 'diikuti' && !displayLoading && followingItems.length === 0 ? (
          <div className="rp-card py-20 text-center">
            <div className="text-5xl mb-4">💞</div>
            <h3 className="font-black text-lg mb-2" style={{ color: "#3D2F6B" }}>Belum mengikuti siapa pun</h3>
            <p className="text-sm mb-4" style={{ color: "#A89CC4" }}>
              Ikuti penjual favoritmu untuk melihat produk mereka di sini.
            </p>
            <button onClick={() => navigate('/home')} className="rp-btn-primary">Temukan Penjual</button>
          </div>
        ) : displayLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="rp-card overflow-hidden">
                <div className="rp-skeleton aspect-square w-full" />
                <div className="p-3 space-y-2">
                  <div className="rp-skeleton h-4 w-3/4" />
                  <div className="rp-skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="rp-card py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-black text-lg mb-2" style={{ color: "#3D2F6B" }}>
              {search ? "Tidak ditemukan" : "Belum ada produk"}
            </h3>
            <p className="text-sm mb-6" style={{ color: "#A89CC4" }}>
              {search ? `Tidak ada hasil untuk "${search}"` : "Jadilah yang pertama upload produk!"}
            </p>
            <button onClick={() => { setSearch(""); setCategory(""); }} className="rp-btn-primary">
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayItems.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm" style={{ borderColor: "#E8DCFF", color: "#A89CC4" }}>
        © 2025 Rentopia — Dibuat dengan 💜
      </footer>
    </div>
  );
}