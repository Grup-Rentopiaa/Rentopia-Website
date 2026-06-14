import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star } from 'lucide-react';
import { likeItemService } from '../services/itemService';

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ item }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const wishlistKey = user ? `rentopia_wishlist_${user.id}` : null;
  const wishlist = wishlistKey ? JSON.parse(localStorage.getItem(wishlistKey) || '[]') : [];
  const [liked, setLiked] = useState(wishlist.includes(item.id));
  const navigate = useNavigate();

  async function handleLike(e) {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    const newLiked = !liked;
    setLiked(newLiked);
    const updated = newLiked
      ? [...wishlist.filter(id => id !== item.id), item.id]
      : wishlist.filter(id => id !== item.id);
    localStorage.setItem(wishlistKey, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('likeChanged'));
    try {
      await likeItemService(item.id, user.id);
    } catch {}
  }

  return (
    <div
      className="rp-product-card group relative"
      onClick={() => navigate(`/product/${item.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden" style={{ background: "#E8DCFF" }}>
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
        )}
        {/* Category badge */}
        {item.category_name && (
          <div className="absolute top-2 left-2">
            <span className="rp-badge rp-badge-primary text-[10px] px-2 py-0.5">{item.category_name}</span>
          </div>
        )}
        {/* Like button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: liked ? "#FFD6EC" : "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(180,150,255,0.2)" }}
        >
          <Heart size={15} fill={liked ? "#FF8FC5" : "none"} color={liked ? "#FF8FC5" : "#C9B8FF"} />
        </button>
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="text-sm font-bold leading-snug line-clamp-2 mb-1" style={{ color: "#3D2F6B" }}>
          {item.title}
        </h3>
        <p className="font-black text-sm mb-1" style={{ color: "#9B87D9" }}>
          {formatPrice(item.price_per_day || item.price)}
          <span className="font-normal text-xs" style={{ color: "#A89CC4" }}>/hari</span>
        </p>
        <div className="flex items-center gap-2 text-xs" style={{ color: "#A89CC4" }}>
          {item.location && (
            <span className="flex items-center gap-0.5 truncate">
              <MapPin size={10} className="flex-shrink-0" />{item.location}
            </span>
          )}
          {item.avg_rating > 0 && (
            <span className="flex items-center gap-0.5 ml-auto flex-shrink-0">
              <Star size={10} fill="#FFD6EC" color="#FFB3D9" />{Number(item.avg_rating).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
