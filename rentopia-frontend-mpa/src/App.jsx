import { useState, useEffect } from 'react';
import './index.css';
import apiFetch from './api';
import useProducts from './hooks/useProducts';
import advancedFeatures from './utils/advancedFeatures';

import Navbar      from './components/Navbar';
import Categories  from './components/Categories';
import Filter      from './components/Filter';
import ItemList    from './components/ItemList';
import BottomNav   from './components/BottomNav';
import UploadPage  from './pages/UploadPage';
import ProfilPage  from './pages/ProfilPage';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [filter,   setFilter]   = useState({
    sort: 'best_match', minPrice: '', maxPrice: '', minRating: '', location: '',
  });
  const [notifications, setNotifications] = useState([]);

  const { items, loading } = useProducts(search, category, filter);

  useEffect(() => {
    if (activePage !== 'home') return;
    const qs = new URLSearchParams({
      search,
      category: category || '',
      sort: filter.sort,
    }).toString();
    advancedFeatures.pushHistoryState({ search, category, filter }, 'Rentopia', `?${qs}`);
  }, [search, category, filter, activePage]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state) {
        setSearch(e.state.search   || '');
        setCategory(e.state.category || '');
        setFilter(e.state.filter   || { sort: 'best_match', minPrice: '', maxPrice: '', minRating: '', location: '' });
        setActivePage('home');
      }
    };
    return advancedFeatures.listenToEvent('popstate', handlePopState);
  }, []);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await apiFetch('/api/notifications');
        setNotifications(data);
      } catch {}
    }
    loadNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HALAMAN HOME ── */}
      {activePage === 'home' && (
        <>
          <Navbar
            search={search}
            onSearchChange={setSearch}
            notifications={notifications}
            category={category}
            onSelectCategory={setCategory}
          />
          <Categories selected={category} onSelect={setCategory} />
          <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
            <div className="flex gap-6 items-start">
              <Filter onApply={setFilter} />
              <ItemList items={items} loading={loading} />
            </div>
          </main>
        </>
      )}

      {/* ── HALAMAN UPLOAD ── */}
      {activePage === 'upload' && (
        <>
          <header className="sticky top-0 z-50 bg-white border-b border-gray-200"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="max-w-lg mx-auto px-4 py-4">
              <h1 className="text-lg font-bold text-gray-900">Upload Produk</h1>
            </div>
          </header>
          <div className="pb-24 bg-gray-50 min-h-screen">
            <UploadPage />
          </div>
        </>
      )}

      {/* ── HALAMAN PROFIL ── */}
      {activePage === 'profil' && (
        <>
          <header className="sticky top-0 z-50 bg-white border-b border-gray-200"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="max-w-lg mx-auto px-4 py-4">
              <h1 className="text-lg font-bold text-gray-900">Menu Saya</h1>
            </div>
          </header>
          <div className="bg-gray-50 min-h-screen">
            <ProfilPage />
          </div>
        </>
      )}

      {/* ── BOTTOM NAVIGATION ── */}
      <BottomNav active={activePage} onChange={setActivePage} />
    </div>
  );
}
