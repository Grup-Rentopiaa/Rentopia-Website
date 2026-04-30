import { useState } from 'react';
import { Heart, MapPin } from 'lucide-react';
import RatingStars from './RatingStars';

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ item }) {
  const [liked, setLiked]       = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="product-card group">
      {/* Image */}
      <div className="relative w-full bg-gray-100 overflow-hidden" style={{ paddingBottom: '66.66%' }}>
        {item.image_url && !imgError ? (
          <img
            src={item.image_url} alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-4xl">📦</div>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(!liked); }}
          title={liked ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center
            shadow-md transition-all duration-150 hover:scale-110
            ${liked ? 'bg-white' : 'bg-white/80 backdrop-blur-sm'}`}
        >
          <Heart size={16} className={liked ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
        </button>

        {/* Category badge — biru tua */}
        {item.category_name && (
          <span className="absolute top-2 left-2 bg-blue-800 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            {item.category_name}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2" title={item.title}>
          {item.title}
        </h3>

        {/* Price — biru utama */}
        <p className="text-blue-600 font-bold text-base mb-1">
          {formatPrice(item.price_per_day)}
          <span className="text-gray-400 font-normal text-xs"> /hari</span>
        </p>

        <div className="mb-1.5">
          <RatingStars rating={Number(item.rating)} count={item.rating_count} size="sm" />
        </div>

        {item.location && (
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin size={11} className="flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
