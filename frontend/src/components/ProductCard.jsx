import { useState } from 'react';
import { Heart, MapPin, Image } from 'lucide-react';

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ item }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="product-card group relative">
      {/* Photo Box */}
      <div className="product-image-box aspect-square w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <Image size={40} strokeWidth={1.5} className="text-gray-300" />
        )}
      </div>

      {/* Category badge - absolute overlay on image */}
      {item.category_name && (
        <div className="absolute top-3 left-3">
          <span className="bg-blue-800/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
            {item.category_name}
          </span>
        </div>
      )}

      {/* Body */}
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1" title={item.title}>
            {item.title}
          </h3>
          <button
            onClick={e => { e.stopPropagation(); setLiked(!liked); }}
            title={liked ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              shadow-sm border transition-all duration-150 hover:scale-110
              ${liked ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}
          >
            <Heart size={15} className={liked ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
          </button>
        </div>

        {/* Price */}
        <p className="text-blue-600 font-bold text-base">
          {formatPrice(item.price_per_day)}
          <span className="text-gray-400 font-normal text-xs"> /hari</span>
        </p>

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
