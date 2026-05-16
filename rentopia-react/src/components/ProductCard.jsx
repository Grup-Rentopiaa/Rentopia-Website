import { useState } from 'react'
import api from '../services/api'

// Wishlist key scoped to the logged-in user to prevent data leaking between accounts
const getWishlistKey = (user) => `rentopia_wishlist_${user?.id || 'guest'}`

export default function ProductCard({ product, onCartAdd, compact = false, user = null }) {
  const [loved, setLoved] = useState(() => {
    const wl = JSON.parse(localStorage.getItem(getWishlistKey(user)) || '[]')
    return wl.some(i => String(i.id) === String(product.id))
  })
  const [likes, setLikes] = useState(product.likes || 0)
  const [pulse, setPulse] = useState(false)

  const toggleLove = async (e) => {
    e.stopPropagation()
    const user = user || JSON.parse(localStorage.getItem('user'))
    if (!user) return alert('Login dulu untuk menyimpan favorit! ✨')

    const isAdding = !loved
    setPulse(true)
    setTimeout(() => setPulse(false), 300)

    try {
      const res = await api.post('/wishlist', {
        user_id: user.id,
        product_id: product.id,
        action: isAdding ? 'add' : 'remove'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      if (res.data.success) {
        const key = getWishlistKey(user)
        let wl = JSON.parse(localStorage.getItem(key) || '[]')
        if (isAdding) { wl.push(product); setLikes(l => l + 1) }
        else { wl = wl.filter(i => i.id !== product.id); setLikes(l => Math.max(0, l - 1)) }
        setLoved(isAdding)
        localStorage.setItem(key, JSON.stringify(wl))
        window.dispatchEvent(new Event('wishlist-update'))
      }
    } catch (err) {
      console.error('Gagal sinkron wishlist:', err)
    }
  }

  return (
    <div className={`bg-[#02214b] rounded-2xl overflow-hidden border border-white/5
                     ${compact ? 'flex-shrink-0 w-[220px]' : 'w-full'}
                     flex flex-col h-[380px]
                     hover:border-[#00d4ff]/30 hover:-translate-y-1
                     hover:shadow-[0_8px_30px_rgba(0,212,255,0.15)]
                     transition-all duration-300`}>

      {/* Image */}
      <div className="relative flex-shrink-0 h-[180px] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = 'https://placehold.co/300x200/02214b/00d4ff?text=Rentopia' }}
        />
        <button
          onClick={toggleLove}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
                      backdrop-blur-md transition-all duration-200
                      ${loved ? 'bg-red-500 text-white' : 'bg-black/40 text-white/70'}
                      ${pulse ? 'scale-125' : 'scale-100'}`}
        >
          <ion-icon name={loved ? 'heart' : 'heart-outline'} style={{ fontSize: '18px' }}></ion-icon>
        </button>
        <span className="absolute bottom-3 left-3 bg-black/60 text-[#00d4ff] text-[10px]
                         font-semibold px-2 py-1 rounded-full">
          📍 {product.distance || '1.2 km'}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex justify-between text-[11px] text-gray-400 mb-1">
          <span className="text-yellow-400 font-semibold">⭐ {product.rate || '4.5'}</span>
          <span>❤️ {likes} suka</span>
        </div>
        <h4 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2 flex-1">
          {product.title}
        </h4>
        <p className="text-[#00d4ff] font-bold text-sm mb-3">
          Rp {Number(product.price).toLocaleString('id-ID')}
          <span className="text-gray-400 font-normal text-[10px]">/hari</span>
        </p>
        <div className="flex gap-2 mt-auto">
          <button
            onClick={e => { e.stopPropagation(); onCartAdd?.() }}
            className="flex-1 bg-[#00d4ff] text-[#0d0232] font-bold text-xs py-2.5 rounded-xl
                       hover:bg-cyan-300 active:scale-95 transition-all"
          >
            Sewa
          </button>
          <button
            onClick={e => { e.stopPropagation(); onCartAdd?.() }}
            className="w-10 bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] rounded-xl
                       flex items-center justify-center hover:bg-[#00d4ff]/20 transition-all"
          >
            <ion-icon name="cart-outline" style={{ fontSize: '16px' }}></ion-icon>
          </button>
        </div>
      </div>
    </div>
  )
}
