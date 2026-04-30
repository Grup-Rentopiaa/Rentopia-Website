import { useState, useRef, useEffect } from 'react';
import { Search, Bell, MessageCircle, User, X, Clock, Bookmark, Camera, Menu } from 'lucide-react';
import apiFetch from '../api';
import { CATEGORIES } from './Categories';

export default function Navbar({ search, onSearchChange, notifications, category, onSelectCategory }) {
  const [showDropdown, setShowDropdown]         = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [savedKeywords, setSavedKeywords] = useState([]);
  const [saving, setSaving]               = useState(false);
  const inputRef       = useRef(null);
  const dropdownRef    = useRef(null);
  const categoryBtnRef = useRef(null);
  const categoryMenuRef= useRef(null);

  const unreadCount = (notifications || []).filter(n => !n.is_read).length;

  useEffect(() => { loadKeywords(); }, []);

  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current    && !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
      if (
        categoryMenuRef.current && !categoryMenuRef.current.contains(e.target) &&
        categoryBtnRef.current  && !categoryBtnRef.current.contains(e.target)
      ) {
        setShowCategoryMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function loadKeywords() {
    try {
      const data = await apiFetch('/api/keywords');
      setSavedKeywords(data);
    } catch {}
  }

  async function saveKeyword() {
    if (!search.trim()) return;
    setSaving(true);
    try {
      await apiFetch('/api/keywords', {
        method: 'POST',
        body: JSON.stringify({ keyword: search.trim() }),
      });
      await loadKeywords();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  }

  async function deleteKeyword(id) {
    try {
      await apiFetch(`/api/keywords/${id}`, { method: 'DELETE' });
      setSavedKeywords(prev => prev.filter(k => k.id !== id));
    } catch {}
  }

  const alreadySaved = savedKeywords.some(
    k => k.keyword.toLowerCase() === search.trim().toLowerCase()
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* Logo */}
        <div className="flex-shrink-0 flex items-center select-none">
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight">Rento</span>
          <span className="text-2xl font-extrabold text-blue-800 tracking-tight">pia</span>
        </div>

        {/* Search bar */}
        <div className="flex-1 relative" ref={dropdownRef}>
          <div className="flex items-center bg-gray-50 border-2 border-blue-600 rounded-xl overflow-hidden focus-within:border-blue-700 transition-colors">
            <div className="pl-4 pr-2 text-gray-400">
              <Search size={18} />
            </div>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 py-2.5 px-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
              placeholder="Cari produk untuk disewa..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              onFocus={() => setShowDropdown(true)}
            />
            {search && (
              <button onClick={() => onSearchChange('')} className="px-2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
            <button
              className="px-3 border-l border-gray-200 text-gray-400 hover:text-blue-600 transition-colors bg-transparent"
              title="Cari dengan Gambar"
              onClick={() => alert('Fitur pencarian gambar akan segera hadir!')}
            >
              <Camera size={18} />
            </button>
            <button
              onClick={() => setShowDropdown(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors flex-shrink-0 flex items-center gap-1.5"
            >
              <Search size={15} />
              Cari
            </button>
          </div>

          {/* Dropdown keyword tersimpan */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              {savedKeywords.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 flex items-center gap-1.5">
                    <Clock size={12} /> Pencarian Tersimpan
                  </div>
                  <div className="p-3 flex flex-wrap gap-2">
                    {savedKeywords.map(kw => (
                      <button
                        key={kw.id}
                        onClick={() => { onSearchChange(kw.keyword); setShowDropdown(false); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm font-medium transition-colors"
                      >
                        <Bookmark size={12} />
                        {kw.keyword}
                        <span
                          onClick={e => { e.stopPropagation(); deleteKeyword(kw.id); }}
                          className="ml-1 text-blue-400 hover:text-red-400 transition-colors"
                        >
                          <X size={12} />
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {search.trim() && !alreadySaved && (
                <button
                  onClick={saveKeyword}
                  disabled={saving}
                  className="w-full px-4 py-3 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100 flex items-center gap-2 font-medium"
                >
                  <Bookmark size={14} />
                  {saving ? 'Menyimpan...' : `Simpan pencarian "${search.trim()}"`}
                </button>
              )}
              {search.trim() && alreadySaved && (
                <p className="px-4 py-3 text-sm text-gray-400 border-t border-gray-100">
                  ✓ Pencarian ini sudah tersimpan
                </p>
              )}
              {!search.trim() && savedKeywords.length === 0 && (
                <p className="px-4 py-4 text-sm text-gray-400 text-center">
                  Belum ada pencarian tersimpan
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1 flex-shrink-0 relative">
          
          {/* Hamburger Menu untuk Kategori */}
          <div className="relative">
            <button
              ref={categoryBtnRef}
              onClick={() => setShowCategoryMenu(prev => !prev)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
              title="Kategori"
            >
              <Menu size={22} className={showCategoryMenu ? 'text-blue-600' : ''} />
            </button>
            
            {showCategoryMenu && (
              <div
                ref={categoryMenuRef}
                className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 font-semibold text-gray-800 text-sm">
                  Kategori Pilihan
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {CATEGORIES.map(({ id, name, Icon }) => {
                    const isActive = category === id;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          onSelectCategory(id);
                          setShowCategoryMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50 last:border-b-0
                          ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}
                        `}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <Icon size={16} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                        </div>
                        <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600" title="Notifikasi">
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600" title="Chat">
            <MessageCircle size={22} />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 font-medium text-sm" title="Akun saya">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={16} className="text-blue-700" />
            </div>
            <span className="hidden md:block">Masuk</span>
          </button>
        </div>
      </div>
    </header>
  );
}
