import { useState, useEffect } from 'react';
import { MapPin, Users, TrendingUp, Grid, SlidersHorizontal, Flame, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../api';
import useProducts from '../hooks/useProducts';
import AppNavbar from '../components/AppNavbar';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../constants/categories';

const RECOMMEND_TABS = [
  { id: 'semua',    label: 'Semua',    icon: <Grid size={13} /> },
  { id: 'trending', label: 'Trending', icon: <TrendingUp size={13} /> },
  { id: 'terdekat', label: 'Terdekat', icon: <MapPin size={13} /> },
  { id: 'diikuti',  label: 'Diikuti',  icon: <Users size={13} /> },
];

const BANNERS = [
  { image: '/Banner.png', category: 'Sports & Outdoor' },
];

export default function HomePage() {
  const user     = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const [search,           setSearch]           = useState('');
  const [category,         setCategory]         = useState('');
  const [recommendTab,     setRecommendTab]     = useState('semua');
  const [showFilter,       setShowFilter]       = useState(false);
  const [filter,           setFilter]           = useState({ sort: 'random', minPrice: '', maxPrice: '' });
  const [bannerIdx,        setBannerIdx]        = useState(0);
  const [wishlistCount,    setWishlistCount]    = useState(0);
  const [followingItems,   setFollowingItems]   = useState([]);
  const [followingLoading, setFollowingLoading] = useState(false);

  const { items, loading } = useProducts(search, category, filter, user?.id);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (recommendTab === 'semua')    setFilter(p => ({ ...p, sort: 'random',   filter: null }));
    if (recommendTab === 'trending') setFilter(p => ({ ...p, sort: 'trending', filter: null }));
    if (recommendTab === 'terdekat') setFilter(p => ({ ...p, sort: 'nearest',  filter: null }));
  }, [recommendTab]);

  useEffect(() => {
    if (recommendTab !== 'diikuti' || !user?.id) return;
    setFollowingLoading(true);
    apiFetch(`/api/feed/following/${user.id}`)
      .then(data => setFollowingItems(Array.isArray(data) ? data : []))
      .catch(() => setFollowingItems([]))
      .finally(() => setFollowingLoading(false));
  }, [recommendTab, user?.id]);

  useEffect(() => {
    function count() {
      if (!user) return;
      const list = JSON.parse(localStorage.getItem(`rentopia_wishlist_${user.id}`) || '[]');
      setWishlistCount(list.length);
    }
    count();
    window.addEventListener('likeChanged', count);
    return () => window.removeEventListener('likeChanged', count);
  }, []);

  const banner         = BANNERS[bannerIdx];
  const displayItems   = recommendTab === 'diikuti' ? followingItems : items;
  const displayLoading = recommendTab === 'diikuti' ? followingLoading : loading;

  return (
    <div className="min-h-screen" style={{background: '#F0EDF8'}}>
      <AppNavbar
        wishlistCount={wishlistCount}
        onSearch={setSearch}
        searchValue={search}
        onSearchSubmit={setSearch}
      />

      {/* Banner */}
      <div style={{background: '#fff', borderBottom: '1px solid #E8DCFF'}}>
        <div className="relative cursor-pointer overflow-hidden"
          style={{height: '220px'}}
          onClick={() => navigate(`/products?category=${encodeURIComponent(banner.category)}`)}>
          <img src={banner.image} alt="banner"
            className="w-full h-full object-cover"
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{display:'none', background:'linear-gradient(135deg,#7C4DFF,#9C6FFF)', height:'220px', width:'100%', alignItems:'center', justifyContent:'center', position:'absolute', top:0, left:0}}>
            <span style={{color:'rgba(255,255,255,0.5)', fontSize:'13px'}}>Upload banner di /public/Banner.png</span>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {BANNERS.map((_, i) => (
              <button key={i}
                onClick={e => { e.stopPropagation(); setBannerIdx(i); }}
                style={{
                  width: i===bannerIdx ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i===bannerIdx ? '#7C4DFF' : 'rgba(255,255,255,0.6)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{background: '#fff', borderBottom: '2px solid #E8DCFF'}}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-xs font-black mb-3 tracking-widest" style={{color: '#888', textTransform: 'uppercase'}}>Kategori</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', border: '1px solid #E8DCFF'}}>

            {/* Tombol Semua */}
            <button
              onClick={() => setCategory('')}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '16px 8px', cursor: 'pointer', border: 'none',
                borderRight: '1px solid #E8DCFF', borderBottom: '1px solid #E8DCFF',
                background: category==='' ? '#F3EEFF' : '#fff',
              }}>
              <div style={{width: '64px', height: '64px', borderRadius: '50%', background: '#F0EEFF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Grid size={28} color="#7C4DFF"/>
              </div>
              <span style={{fontSize: '11px', fontWeight: '700', color: category==='' ? '#7C4DFF' : '#333', textAlign: 'center', lineHeight: '1.3'}}>Semua</span>
            </button>

            {CATEGORIES.map((cat, idx) => (
              <button key={cat.id}
                onClick={() => setCategory(category===cat.id ? '' : cat.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  padding: '16px 8px', cursor: 'pointer', border: 'none',
                  borderRight: (idx + 1) % 8 === 7 ? 'none' : '1px solid #E8DCFF',
                  borderBottom: '1px solid #E8DCFF',
                  background: category===cat.id ? '#F3EEFF' : '#fff',
                }}>
                <div style={{width: '64px', height: '64px', borderRadius: '50%', background: '#F5F5F5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{width: '100%', height: '100%', objectFit: 'cover'}}
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span style={{display: 'none', fontSize: '24px'}}>📦</span>
                </div>
                <span style={{fontSize: '11px', fontWeight: '700', color: category===cat.id ? '#7C4DFF' : '#333', textAlign: 'center', lineHeight: '1.3', maxWidth: '64px'}}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 py-3">

        {/* Tabs + Filter */}
        <div style={{background: '#fff', borderRadius: '10px', border: '1px solid #E8DCFF', padding: '10px 14px', marginBottom: '8px'}}>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {RECOMMEND_TABS.map(tab => (
                <button key={tab.id}
                  onClick={() => setRecommendTab(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all"
                  style={{
                    background: recommendTab===tab.id ? '#7C4DFF' : 'transparent',
                    color: recommendTab===tab.id ? '#fff' : '#9B87D9',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>
            <button onClick={() => setShowFilter(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold"
              style={{
                background: showFilter ? '#7C4DFF' : '#F3EEFF',
                color: showFilter ? '#fff' : '#7C4DFF',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}>
              <SlidersHorizontal size={13}/> Filter
            </button>
          </div>

          {showFilter && (
            <div style={{borderTop: '1px solid #E8DCFF', marginTop: '10px', paddingTop: '10px'}}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{color: '#666'}}>Harga Min (Rp)</label>
                  <input type="number" value={filter.minPrice}
                    onChange={e => setFilter(p => ({...p, minPrice: e.target.value}))}
                    placeholder="0" className="rp-input text-sm py-2"/>
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{color: '#666'}}>Harga Max (Rp)</label>
                  <input type="number" value={filter.maxPrice}
                    onChange={e => setFilter(p => ({...p, maxPrice: e.target.value}))}
                    placeholder="∞" className="rp-input text-sm py-2"/>
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{color: '#666'}}>Urutkan</label>
                  <select value={filter.sort}
                    onChange={e => setFilter(p => ({...p, sort: e.target.value}))}
                    className="rp-input text-sm py-2">
                    <option value="random">Default</option>
                    <option value="price_asc">Harga Terendah</option>
                    <option value="price_desc">Harga Tertinggi</option>
                    <option value="trending">Paling Populer</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <button onClick={() => setFilter({sort:'random', minPrice:'', maxPrice:''})}
                  className="rp-btn-outline text-sm py-2 flex-1">Reset</button>
                <button onClick={() => setShowFilter(false)}
                  className="rp-btn-primary text-sm py-2 flex-1">Terapkan</button>
              </div>
            </div>
          )}
        </div>

        {/* Product Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {recommendTab === 'trending' && <Flame size={14} color="#FF4D4F"/>}
            {recommendTab === 'semua' && <Zap size={14} color="#7C4DFF"/>}
            <h2 className="font-black text-sm" style={{color: '#1A1A2E'}}>
              {search ? `Hasil "${search}"` :
               category ? category :
               recommendTab === 'trending' ? 'Trending Sekarang' :
               recommendTab === 'terdekat' ? 'Terdekat dari Kamu' :
               recommendTab === 'diikuti'  ? 'Dari Yang Kamu Ikuti' : 'Semua Produk'}
            </h2>
          </div>
          {!displayLoading && (
            <span className="text-xs font-bold px-2 py-0.5"
              style={{background: '#EDE9FE', color: '#7C4DFF', borderRadius: '6px'}}>
              {displayItems.length} barang
            </span>
          )}
        </div>

        {/* Products */}
        {recommendTab === 'diikuti' && !displayLoading && followingItems.length === 0 ? (
          <div className="rp-card py-16 text-center">
            <div className="text-5xl mb-3">💞</div>
            <h3 className="font-black text-base mb-1" style={{color: '#1A1A2E'}}>Belum mengikuti siapa pun</h3>
            <p className="text-sm mb-4" style={{color: '#888'}}>Ikuti penjual favoritmu untuk melihat produk mereka di sini.</p>
            <button onClick={() => navigate('/home')} className="rp-btn-primary">Temukan Penjual</button>
          </div>
        ) : displayLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="rp-card overflow-hidden">
                <div className="rp-skeleton aspect-square w-full"/>
                <div className="p-3 space-y-2">
                  <div className="rp-skeleton h-3 w-3/4"/>
                  <div className="rp-skeleton h-3 w-1/2"/>
                </div>
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="rp-card py-16 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-black text-base mb-1" style={{color: '#1A1A2E'}}>
              {search ? 'Tidak ditemukan' : 'Belum ada produk'}
            </h3>
            <p className="text-sm mb-4" style={{color: '#888'}}>
              {search ? `Tidak ada hasil untuk "${search}"` : 'Jadilah yang pertama upload produk!'}
            </p>
            <button onClick={() => {setSearch(''); setCategory('');}} className="rp-btn-primary">
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {displayItems.map(item => (
              <ProductCard key={item.id} item={item}/>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-6 py-5 text-center text-xs"
        style={{borderTop: '1px solid #E8DCFF', color: '#aaa', background: '#fff'}}>
        © 2026 Rentopia · Oleh kelompok 3 MWP kelas B
      </footer>
    </div>
  );
}