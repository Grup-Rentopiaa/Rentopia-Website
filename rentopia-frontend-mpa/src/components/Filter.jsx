import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Star } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'best_match', label: 'Paling Relevan' },
  { value: 'price_asc',  label: 'Harga Termurah' },
  { value: 'price_desc', label: 'Harga Termahal' },
  { value: 'rating',     label: 'Rating Terbaik' },
  { value: 'nearest',    label: 'Terdekat' },
];

const LOCATIONS = [
  '', 'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta',
  'Bali', 'Medan', 'Bogor', 'Bekasi', 'Tangerang', 'Depok', 'Solo',
];

const RATING_OPTIONS = [
  { value: 4.5, label: '4.5 ke atas' },
  { value: 4.0, label: '4.0 ke atas' },
  { value: 3.5, label: '3.5 ke atas' },
  { value: 3.0, label: '3.0 ke atas' },
];

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section last:border-b-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full mb-0"
      >
        <span className="filter-label mb-0">{title}</span>
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function Filter({ onApply }) {
  const [sort,      setSort]      = useState('best_match');
  const [minPrice,  setMinPrice]  = useState('');
  const [maxPrice,  setMaxPrice]  = useState('');
  const [minRating, setMinRating] = useState('');
  const [location,  setLocation]  = useState('');

  function handleApply() {
    onApply({ sort, minPrice, maxPrice, minRating, location });
  }

  function handleReset() {
    setSort('best_match');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setLocation('');
    onApply({ sort: 'best_match', minPrice: '', maxPrice: '', minRating: '', location: '' });
  }

  return (
    <aside className="w-56 flex-shrink-0 sticky top-[56px] self-start">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
          <SlidersHorizontal size={16} className="text-blue-600" />
          <span className="font-bold text-gray-800 text-sm">Filter</span>
        </div>

        {/* Urutkan */}
        <Section title="Urutkan" defaultOpen={true}>
          <div className="space-y-1.5">
            {SORT_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setSort(opt.value)}
                  className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${sort === opt.value ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'}
                  `}
                >
                  {sort === opt.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span
                  onClick={() => setSort(opt.value)}
                  className={`text-sm ${sort === opt.value ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}
                >
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </Section>

        {/* Rentang Harga */}
        <Section title="Rentang Harga / Hari">
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
              <input
                type="number"
                placeholder="Minimum"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                min="0"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div className="flex items-center justify-center text-gray-300 text-xs font-medium">s/d</div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
              <input
                type="number"
                placeholder="Maksimum"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                min="0"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors"
              />
            </div>
          </div>
        </Section>

        {/* Rating */}
        <Section title="Rating">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => setMinRating('')}
                className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                  ${minRating === '' ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'}
                `}
              >
                {minRating === '' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span onClick={() => setMinRating('')} className={`text-sm ${minRating === '' ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>
                Semua Rating
              </span>
            </label>
            {RATING_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setMinRating(opt.value)}
                  className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${minRating === opt.value ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'}
                  `}
                >
                  {minRating === opt.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <div onClick={() => setMinRating(opt.value)} className="flex items-center gap-1">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className={`text-sm ${minRating === opt.value ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>
                    {opt.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </Section>

        {/* Lokasi */}
        <Section title="Lokasi">
          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors bg-white text-gray-700"
          >
            <option value="">Semua Lokasi</option>
            {LOCATIONS.filter(l => l).map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </Section>

        {/* Tombol aksi */}
        <button
          onClick={handleApply}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors mt-2"
        >
          Terapkan Filter
        </button>
        <button
          onClick={handleReset}
          className="w-full py-2 mt-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw size={13} />
          Atur Ulang
        </button>
      </div>
    </aside>
  );
}
