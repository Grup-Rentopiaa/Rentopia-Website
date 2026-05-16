import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CART_KEY = 'rentopia_cart'
// Returns a per-user wishlist key so accounts never share wishlist data
const getWishlistKey = (userId) => `rentopia_wishlist_${userId || 'guest'}`

export default function WishlistPage() {
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [sortType, setSortType] = useState('default')
  const [confirmModal, setConfirmModal] = useState(false)
  const [toasts, setToasts] = useState([])
  const [wishlistKey, setWishlistKey] = useState(getWishlistKey(null))

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { navigate('/'); return }
    const user = JSON.parse(stored)
    const key = getWishlistKey(user.id)
    setWishlistKey(key)
    loadWishlist(key)
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    setCartCount(cart.length)
  }, [])

  const loadWishlist = (key) => {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    setWishlist(data)
  }

  const showToast = (msg) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => String(item.id) !== String(id))
    setWishlist(updated)
    localStorage.setItem(wishlistKey, JSON.stringify(updated))
    window.dispatchEvent(new Event('wishlist-update'))
    showToast('Barang dihapus dari wishlist 🗑️')
  }

  const clearWishlist = () => {
    setWishlist([])
    localStorage.setItem(wishlistKey, JSON.stringify([]))
    window.dispatchEvent(new Event('wishlist-update'))
    setConfirmModal(false)
    showToast('Wishlist berhasil dibersihkan! 🧹')
  }

  const exportCSV = () => {
    if (wishlist.length === 0) { showToast('Wishlist kosong! 😅'); return }
    const headers = ['Nama Produk', 'Harga', 'Kategori', 'Rating']
    const rows = wishlist.map(i => [`"${i.title}"`, `"${i.price}"`, `"${i.category || 'Umum'}"`, `"${i.rate || '4.9'}"`])
    const csv = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', 'Rentopia_Wishlist.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Wishlist diekspor ke CSV! 📥')
  }

  const sortedWishlist = [...wishlist].sort((a, b) => {
    if (sortType === 'low') return a.price - b.price
    if (sortType === 'high') return b.price - a.price
    return 0
  })

  return (
    <div className="min-h-screen bg-[#0d0232] text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full h-[70px] flex items-center justify-between px-5
                      bg-[#02214b]/90 backdrop-blur-md border-b border-white/10 z-[1000]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')}
            className="bg-white/10 p-2 rounded-xl cursor-pointer text-[#00d4ff] hover:bg-white/20 transition-all">
            <ion-icon name="arrow-back-outline" style={{ fontSize: '22px' }}></ion-icon>
          </button>
          <h3 className="text-[#00d4ff] font-black text-xl tracking-widest">WISHLIST</h3>
        </div>
        <div className="relative cursor-pointer text-[#00d4ff]">
          <ion-icon name="cart-outline" style={{ fontSize: '26px' }}></ion-icon>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px]
                             font-bold px-1.5 py-0.5 rounded-full border-2 border-[#02214b]">
              {cartCount}
            </span>
          )}
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-[1200px] mx-auto px-4 pt-[100px] pb-16">

        {/* Header */}
        <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-black">Daftar Favorit</h2>
            <p className="text-gray-400 mt-1">
              Ada <span className="text-[#00d4ff] font-bold">{wishlist.length}</span> barang yang kamu incar.
            </p>
            <select value={sortType} onChange={e => setSortType(e.target.value)}
              className="mt-3 bg-white/5 border border-white/20 text-white text-sm px-4 py-2 rounded-xl outline-none cursor-pointer">
              <option value="default">Urutkan Harga</option>
              <option value="low">Termurah - Tertinggi</option>
              <option value="high">Tertinggi - Termurah</option>
            </select>
          </div>
          <button onClick={() => setConfirmModal(true)}
            className="bg-red-500/20 border border-red-500/40 text-red-400 font-bold px-5 py-2.5
                       rounded-xl hover:bg-red-500/30 transition-all text-sm">
            Hapus Semua
          </button>
        </div>

        {/* Wishlist Grid */}
        {sortedWishlist.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-4 opacity-30">💝</div>
            <h3 className="text-xl font-bold text-white mb-2">Wishlist Kosong...</h3>
            <p className="text-gray-400 mb-6">Yuk, cari barang keren lagi di Beranda!</p>
            <button onClick={() => navigate('/')}
              className="bg-[#00d4ff] text-[#0d0232] font-black px-6 py-3 rounded-xl hover:bg-cyan-300 transition-all">
              Ke Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedWishlist.map(product => (
              <div key={product.id}
                className="bg-[#02214b] rounded-2xl overflow-hidden border border-white/5
                           hover:border-[#00d4ff]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                {/* Image */}
                <div className="relative h-[160px] overflow-hidden">
                  <img src={product.image} alt={product.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = 'https://placehold.co/300x200/02214b/00d4ff?text=Rentopia' }} />
                  <span className="absolute bottom-2 left-2 bg-black/60 text-[#00d4ff] text-[10px] font-semibold px-2 py-1 rounded-full">
                    📍 {product.distance || '1.2 km'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                    <span className="text-yellow-400 font-semibold">⭐ {product.rate || '4.5'}</span>
                    <span>❤️ 1 suka</span>
                  </div>
                  <h4 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2 flex-1">
                    {product.title}
                  </h4>
                  <p className="text-[#2b78e4] font-black text-sm mb-3">
                    Rp {Number(product.price).toLocaleString('id-ID')}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <button
                      className="flex-1 bg-[#00d4ff] text-[#0d0232] font-bold text-xs py-2.5 rounded-xl
                                 hover:bg-cyan-300 transition-all flex items-center justify-center gap-1">
                      <ion-icon name="chatbubble-ellipses-outline" style={{ fontSize: '14px' }}></ion-icon>
                      Chat
                    </button>
                    <button onClick={() => removeFromWishlist(product.id)}
                      className="w-10 bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl
                                 flex items-center justify-center hover:bg-red-500/20 transition-all">
                      <ion-icon name="trash-outline" style={{ fontSize: '16px' }}></ion-icon>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Export CSV */}
        <div className="text-center mt-12">
          <button onClick={exportCSV}
            className="bg-[#00d4ff] text-[#02214b] font-black px-6 py-3 rounded-xl
                       hover:bg-cyan-300 transition-all text-sm">
            EKSPOR WISHLIST (CSV)
          </button>
        </div>
      </main>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-[#02214b] rounded-3xl p-8 max-w-xs w-full mx-4 text-center border border-white/10">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-white font-black text-lg mb-2">HAPUS SEMUA</h3>
            <p className="text-gray-400 text-sm mb-6">Data wishlist akan dikosongkan permanen. Yakin?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(false)}
                className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all">
                TIDAK
              </button>
              <button onClick={clearWishlist}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-all">
                IYA, HAPUS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className="fixed bottom-6 right-4 z-[9000] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className="bg-[#02214b] border border-[#00d4ff]/30 text-white px-4 py-3 rounded-xl text-sm">
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
