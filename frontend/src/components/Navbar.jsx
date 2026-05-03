import { useState, useRef, useEffect } from 'react';
import { Search, Bell, MessageCircle, X, Clock, Bookmark, Camera, Menu, User, Home, Upload, LogOut } from 'lucide-react';
import apiFetch from '../api';
import { CATEGORIES } from './Categories';

export default function Navbar({ search, onSearchChange, notifications, category, onSelectCategory, activePage, setActivePage }) {
  const [showDropdown, setShowDropdown]         = useState(false);
  const [showSidebar, setShowSidebar]           = useState(false);
  const [savedKeywords, setSavedKeywords] = useState([]);
  const [saving, setSaving]               = useState(false);
  const inputRef       = useRef(null);
  const dropdownRef    = useRef(null);
  const sidebarRef     = useRef(null);

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
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showSidebar]);

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
    <>
      {/* Backdrop */}
      {showSidebar && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`sidebar-drawer ${showSidebar ? 'open' : 'closed'}`} ref={sidebarRef}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">Halo, Admin Rentopia!</p>
                <p className="text-xs text-blue-100">Selamat datang di Rentopia</p>
              </div>
            </div>
            <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {/* Quick Links */}
            <div className="px-4 mb-6">
              <p className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Menu Utama</p>
              <div className="space-y-1">
                {[
                  { id: 'home',   label: 'Beranda', Icon: Home },
                  { id: 'upload', label: 'Upload Produk', Icon: Upload },
                  { id: 'profil', label: 'Profil Saya', Icon: User },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setActivePage(id); setShowSidebar(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                      ${activePage === id ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div className="px-4">
              <p className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Kategori</p>
              <div className="grid grid-cols-1 gap-1">
                {CATEGORIES.map(({ id, name, Icon }) => {
                  const isActive = category === id;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        onSelectCategory(id);
                        setShowSidebar(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                        ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Icon size={16} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                      </div>
                      <span className="text-sm">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut size={18} />
              <span className="text-sm font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* Hamburger Menu (NOW ON THE LEFT) */}
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 flex-shrink-0"
            title="Menu Utama"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center select-none cursor-pointer"
            onClick={() => setActivePage('home')}
          >
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
          <div className="flex items-center gap-1 flex-shrink-0">
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
          </div>
        </div>
      </header>
    </>
  );
}
