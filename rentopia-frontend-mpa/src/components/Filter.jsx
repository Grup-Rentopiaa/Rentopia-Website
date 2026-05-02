import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw, X } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'best_match', label: 'Paling Relevan' },
  { value: 'price_asc',  label: 'Harga Termurah' },
  { value: 'price_desc', label: 'Harga Termahal' },
  { value: 'nearest',    label: 'Terdekat' },
];

const LOCATIONS = [
  '', 'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta',
  'Bali', 'Medan', 'Bogor', 'Bekasi', 'Tangerang', 'Depok', 'Solo',
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

export default function Filter({ onApply, isOpen, onClose }) {
  const [sort,     setSort]     = useState('best_match');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');

  function handleApply() {
    onApply({ sort, minPrice, maxPrice, location });
    onClose();
  }

  function handleReset() {
    setSort('best_match');
    setMinPrice('');
    setMaxPrice('');
    setLocation('');
    onApply({ sort: 'best_match', minPrice: '', maxPrice: '', location: '' });
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="sidebar-backdrop z-[105]" onClick={onClose} />
      )}

      {/* Drawer */}
      <aside className={`filter-drawer-right ${isOpen ? 'open' : 'closed'}`}>
        <div className="h-full flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-blue-600" />
              <span className="font-bold text-gray-900 text-lg">Filter Pencarian</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Urutkan */}
            <Section title="Urutkan" defaultOpen={true}>
              <div className="space-y-3">
                {SORT_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setSort(opt.value)}
                      className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                        ${sort === opt.value ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'}
                      `}
                    >
                      {sort === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
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
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                  <input
                    type="number"
                    placeholder="Minimum"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    min="0"
                    className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all"
                  />
                </div>
                <div className="flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-widest">s/d</div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                  <input
                    type="number"
                    placeholder="Maksimum"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    min="0"
                    className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all"
                  />
                </div>
              </div>
            </Section>

            {/* Lokasi */}
            <Section title="Lokasi">
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all bg-white text-gray-700 appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239CA3AF\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2rem' }}
              >
                <option value="">Semua Lokasi</option>
                {LOCATIONS.filter(l => l).map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </Section>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
            <button
              onClick={handleApply}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              Terapkan Filter
            </button>
            <button
              onClick={handleReset}
              className="w-full py-3 text-sm text-gray-500 hover:text-gray-800 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw size={14} />
              Atur Ulang
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
