import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BANNERS = [
  { id: 1, src: '/banner1.png', alt: 'Promo Elektronik' },
  { id: 2, src: '/banner2.png', alt: 'Petualangan Outdoor' },
  { id: 3, src: '/banner3.png', alt: 'Inspirasi Musik & Edukasi' },
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
    <div className="banner-container group">
      {BANNERS.map((banner, index) => (
        <img
          key={banner.id}
          src={banner.src}
          alt={banner.alt}
          className={`banner-slide ${index === current ? 'opacity-100' : 'opacity-0'}`}
          style={{ position: index === current ? 'relative' : 'absolute' }}
        />
      ))}

      {/* Overlay controls */}
      <div className="absolute inset-0 flex items-end p-4">
        <div className="flex gap-2">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${index === current ? 'bg-white w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
