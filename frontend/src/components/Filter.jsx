import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw, X } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'best_match', label: 'Paling Relevan' },
  { value: 'price_asc',  label: 'Harga Termurah' },
  { value: 'price_desc', label: 'Harga Termahal' },
  { value: 'nearest',    label: 'Terdekat' },
];

const LOCATIONS = [
  'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta',
  'Bali', 'Medan', 'Bogor', 'Bekasi', 'Tangerang', 'Depok', 'Solo',
];

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function Filter({ onApply, isOpen, onClose }) {
  const [sort, setSort] = useState('best_match');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');

  const handleApply = () => {
    onApply({ sort, minPrice, maxPrice, location });
    onClose();
  };

  const handleReset = () => {
    setSort('best_match');
    setMinPrice('');
    setMaxPrice('');
    setLocation('');
    onApply({ sort: 'best_match', minPrice: '', maxPrice: '', location: '' });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={onClose} />
      )}

      {/* Drawer */}
      <aside className={`fixed top-0 right-0 h-full w-[320px] bg-white z-[110] shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-purple-600" />
              <span className="font-bold text-gray-900 text-lg">Filter</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <Section title="Urutkan">
              <div className="space-y-3">
                {SORT_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="sort"
                      checked={sort === opt.value}
                      onChange={() => setSort(opt.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className={`text-sm ${sort === opt.value ? 'text-purple-700 font-semibold' : 'text-gray-600'}`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </Section>

            <Section title="Rentang Harga">
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500"
                />
              </div>
            </Section>

            <Section title="Lokasi">
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 bg-white"
              >
                <option value="">Semua Lokasi</option>
                {LOCATIONS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </Section>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
            <button
              onClick={handleApply}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-all"
            >
              Terapkan
            </button>
            <button
              onClick={handleReset}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} /> Atur Ulang
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
