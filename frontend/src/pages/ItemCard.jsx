import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, MapPin, Package } from "lucide-react"
import { likeItemService } from "../services/itemService"

export default function ItemCard({ item }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  const [liked, setLiked] = useState(item.likes?.some(l => l.user_id === user?.id) || false)
  const isAvailable = item.status !== 'rented'
  
  async function handleLike(e) {
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const res = await likeItemService(item.id, user.id)
      setLiked(res.liked)
      // Dispatch a custom event so other components can react to like changes
      window.dispatchEvent(new CustomEvent('likeChanged'));
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div 
      onClick={() => navigate(`/product/${item.id}`)}
      className="group flex flex-col overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-2 hover:shadow-2xl hover:ring-purple-500 cursor-pointer relative"
    >
      {/* Image */}
      <div className="aspect-square w-full overflow-hidden bg-slate-100 relative">
        {item.image ? (
          <img src={item.image} alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Package size={48} />
          </div>
        )}
        
        {/* Like Button */}
        <button 
          onClick={handleLike}
          className={`absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md shadow-lg transition-all active:scale-90 ${liked ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-400 hover:text-red-500'}`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-sm ${isAvailable ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
            {isAvailable ? 'Tersedia' : 'Disewa'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{item.category_name || 'Produk'}</p>
          <p className="font-bold text-slate-900 leading-tight line-clamp-2">{item.title}</p>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <MapPin size={14} />
          <p className="text-xs font-medium truncate">{item.location || 'Lokasi tidak tersedia'}</p>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-50">
          <div>
            <p className="text-xs text-slate-400 font-medium">Harga sewa</p>
            <p className="text-lg font-black text-purple-600">
              Rp {Number(item.price_per_day).toLocaleString('id-ID')}
              <span className="text-[10px] text-slate-400 font-normal ml-1">/hari</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
