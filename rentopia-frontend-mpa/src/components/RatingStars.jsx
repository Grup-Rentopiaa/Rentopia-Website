import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, count = 0, size = 'sm' }) {
  const fullStars  = Math.floor(rating);
  const hasHalf    = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const starSize   = size === 'sm' ? 12 : 14;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {/* Bintang penuh */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            size={starSize}
            className="text-yellow-400 fill-yellow-400"
          />
        ))}
        {/* Bintang setengah (simulasi dengan opacity) */}
        {hasHalf && (
          <div className="relative">
            <Star size={starSize} className="text-gray-300 fill-gray-200" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={starSize} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        )}
        {/* Bintang kosong */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={starSize} className="text-gray-300 fill-gray-200" />
        ))}
      </div>
      {rating > 0 && (
        <span className={`font-semibold text-gray-700 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {Number(rating).toFixed(1)}
        </span>
      )}
      {count > 0 && (
        <span className={`text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({count >= 1000 ? `${(count / 1000).toFixed(1)}rb` : count})
        </span>
      )}
    </div>
  );
}
