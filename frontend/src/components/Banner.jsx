import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BANNERS = [
  { id: 1, src: '/banner1.png', alt: 'Promo Elektronik & Gadget' },
  { id: 2, src: '/banner2.png', alt: 'Petualangan Outdoor Hemat' },
  { id: 3, src: '/banner3.png', alt: 'Kendaraan & Alat Musik' },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((current + 1) % BANNERS.length);
  const prev = () => setCurrent((current - 1 + BANNERS.length) % BANNERS.length);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl mb-6 shadow-sm border border-gray-100 group bg-gray-200"
      style={{ aspectRatio: '1920 / 600' }}
    >
      {BANNERS.map((banner, index) => (
        <img
          key={banner.id}
          src={banner.src}
          alt={banner.alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
          style={{ opacity: index === current ? 1 : 0 }}
        />
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current ? 'bg-white w-8' : 'bg-white/50 w-2.5'
            }`}
          />
        ))}
      </div>

      {/* Prev/Next buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 z-10"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
