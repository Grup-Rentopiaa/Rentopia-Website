import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/api'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import WishlistModal from '../components/WishlistModal.jsx'
import CookieBanner from '../components/CookieBanner.jsx'

const FILTER_TABS = ['Semua', 'Peringkat Atas', 'Terdekat', 'Ikuti']

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState({ username: 'Titha' })
  const [allProducts, setAllProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [recoList, setRecoList] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Semua')
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [wishlistModal, setWishlistModal] = useState(null)
  const [toasts, setToasts] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortOption, setSortOption] = useState('default')

  useEffect(() => {
    fetchProducts()
    syncWishlistBadge()
    window.addEventListener('wishlist-update', syncWishlistBadge)
    return () => window.removeEventListener('wishlist-update', syncWishlistBadge)
  }, [])

  useEffect(() => {
    let result = [...allProducts]
    if (searchQuery) result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    if (categoryFilter !== 'all') result = result.filter(p => p.category === categoryFilter)
    if (sortOption === 'priceLowHigh') result.sort((a, b) => a.price - b.price)
    if (sortOption === 'priceHighLow') result.sort((a, b) => b.price - a.price)
    setFiltered(result)
  }, [searchQuery, categoryFilter, sortOption, allProducts])

  const syncWishlistBadge = () => {
    const wl = JSON.parse(localStorage.getItem('rentopia_wishlist') || '[]')
    setWishlistCount(wl.length)
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await productService.getAll()
      const mapped = res.data.map(p => ({
        id: p.id,
        title: p.name || p.title,
        price: p.price,
        image: p.image || p.image_url,
        rate: p.rating || p.rate || '4.5',
        distance: p.distance || '1.2 km',
        likes: parseInt(p.loves || p.likes || 0),
        category: p.category
      }))
      setAllProducts(mapped)
      setFiltered(mapped)
      applyRecoFilter('Peringkat Atas', mapped)
    } catch (err) {
      showToast('Database Offline — Pastikan node server.js jalan!')
    } finally {
      setLoading(false)
    }
  }

  const applyRecoFilter = (type, products = allProducts) => {
    setActiveTab(type)
    if (type === 'Ikuti') { setRecoList([]); return }
    let list = [...products]
    if (type === 'Peringkat Atas') list.sort((a, b) => b.rate - a.rate)
    if (type === 'Terdekat') list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    setRecoList(list.slice(0, 6))
  }

  const showToast = (msg) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  const addToCart = () => {
    setCartCount(c => c + 1)
    showToast('Berhasil simpan ke keranjang!')
  }

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0d0232] text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>

      <Navbar wishlistCount={wishlistCount} cartCount={cartCount} onCartClick={() => showToast('Fitur keranjang segera hadir!')} />

      <main className="max-w-[1200px] mx-auto px-4 pt-[90px] pb-16">

        <section className="bg-[#02214b] rounded-3xl p-6 mb-7 border border-white/5 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-1">Selamat Datang</p>
            <h1 className="text-white font-black text-2xl">
              {user ? `HALO, ${user.username.toUpperCase()}!` : 'SIAP MENYEWA?'}
            </h1>
          </div>
          <img
            src={`https://ui-avatars.com/api/?name=${user.username}&background=00d4ff&color=fff`}
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-[#00d4ff]"
          />
        </section>

        <section className="mb-10">
          <div className="h-[220px] rounded-[24px] flex items-center justify-center text-center bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(rgba(2,33,75,0.45), rgba(2,33,75,0.45)), url('https://i.pinimg.com/736x/a6/81/c8/a681c8503599e815c036e3a6fd21611c.jpg')` }}>
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg">SEWA APA SAJA!</h1>
              <p className="text-[#00d4ff] font-semibold mt-2">Barang impian, harga teman di Rentopia.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <h3 className="font-black text-lg">Rekomendasi Untukmu</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTER_TABS.map(tab => (
                <button key={tab} onClick={() => applyRecoFilter(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all
                              ${activeTab === tab ? 'bg-[#00d4ff] text-[#0d0232] border-[#00d4ff]' : 'border-[#00d4ff]/30 text-gray-300 hover:border-[#00d4ff]/60'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-row flex-nowrap overflow-x-auto gap-4 pb-6" style={{ scrollbarWidth: 'none' }}>
            {activeTab === 'Ikuti' ? (
              <p className="text-gray-400 text-sm py-8">Ikuti toko dulu untuk melihat rekomendasi ini.</p>
            ) : loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[220px] h-[360px] bg-[#02214b]/60 rounded-2xl animate-pulse" />
              ))
            ) : recoList.map(p => (
              <ProductCard key={p.id} product={p} compact={true} onCartAdd={addToCart} />
            ))}
          </div>
        </section>

        <section className="mb-6">
          <div className="flex gap-3 items-center">
            <div className="flex-1 flex items-center gap-2 bg-[#02214b] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#00d4ff]/60 transition-all">
              <ion-icon name="search-outline" style={{ fontSize: '18px', color: '#00d4ff' }}></ion-icon>
              <input type="text" placeholder="Cari barang sewaanmu..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500" />
            </div>
            <button onClick={() => setFilterOpen(o => !o)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all
                          ${filterOpen ? 'bg-[#00d4ff] text-[#0d0232] border-[#00d4ff]' : 'bg-[#02214b] text-[#00d4ff] border-white/10'}`}>
              <ion-icon name="options-outline" style={{ fontSize: '20px' }}></ion-icon>
            </button>
          </div>

          {filterOpen && (
            <div className="mt-3 flex gap-3 flex-wrap">
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                className="flex-1 min-w-[140px] bg-[#02214b] border border-white/10 text-white text-sm px-4 py-3 rounded-xl outline-none">
                <option value="all">Semua Kategori</option>
                <option value="electronics">Elektronik</option>
                <option value="camping">Camping</option>
              </select>
              <select value={sortOption} onChange={e => setSortOption(e.target.value)}
                className="flex-1 min-w-[140px] bg-[#02214b] border border-white/10 text-white text-sm px-4 py-3 rounded-xl outline-none">
                <option value="default">Urutkan</option>
                <option value="priceLowHigh">Harga Terendah</option>
                <option value="priceHighLow">Harga Tertinggi</option>
              </select>
            </div>
          )}
        </section>

        <section>
          <h3 className="font-black text-lg mb-5">Eksplor Produk Terbaru</h3>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-[360px] bg-[#02214b]/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">??</div>
              <p>Barang tidak ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} compact={false} onCartAdd={addToCart} />
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-24 right-4 z-[9000] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className="bg-[#02214b] border border-[#00d4ff]/30 text-white px-4 py-3 rounded-xl text-sm">
            {t.msg}
          </div>
        ))}
      </div>

      {wishlistModal && <WishlistModal type={wishlistModal} onClose={() => setWishlistModal(null)} />}
      <CookieBanner />
    </div>
  )
}
