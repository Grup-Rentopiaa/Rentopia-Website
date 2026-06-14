

import { CATEGORIES } from '../constants/categories';

export default function Categories({ selected, onSelect }) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-stretch overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(({ id, name, Icon }) => {
            const isActive = selected === id;
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className={`
                  flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium whitespace-nowrap
                  border-b-2 transition-all duration-150 flex-shrink-0
                  ${isActive
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-colors
                  ${isActive ? 'bg-purple-50' : 'bg-gray-100'}
                `}>
                  <Icon size={20} className={isActive ? 'text-purple-600' : 'text-gray-400'} />
                </div>
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
