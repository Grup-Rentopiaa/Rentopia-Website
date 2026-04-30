import { Search, PlusSquare, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home',   label: 'Beranda',       Icon: Search },
  { id: 'upload', label: 'Upload Produk', Icon: PlusSquare },
  { id: 'profil', label: 'Saya',          Icon: User },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200"
         style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.07)' }}>
      <div className="flex items-stretch">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-0.5
                py-2.5 text-xs font-medium transition-colors duration-150
                ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'}
              `}
            >
              <Icon
                size={22}
                className={`transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span className={isActive ? 'font-semibold' : ''}>{label}</span>
              {/* Active indicator dot */}
              <span className={`w-1 h-1 rounded-full mt-0.5 transition-opacity ${isActive ? 'bg-blue-600 opacity-100' : 'opacity-0'}`} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
