import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import './index.css';
import apiFetch from './api';
import useProducts from './hooks/useProducts';
import { pushHistoryState, listenToEvent } from './utils/Features';

import Navbar from './components/Navbar';
import Categories from './components/Categories';
import Filter from './components/Filter';
import ItemList from './components/ItemList';
import Banner from './components/Banner';
import Footer from './components/Footer';
import UploadPage from './pages/UploadPage';
import ProfilPage from './pages/ProfilPage';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState({
    sort: 'best_match', minPrice: '', maxPrice: '', location: '',
  });
  const [notifications, setNotifications] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const { items, loading } = useProducts(search, category, filter);

  useEffect(() => {
    if (activePage !== 'home') return;
    const qs = new URLSearchParams({
      search,
      category: category || '',
      sort: filter.sort,
    }).toString();
    pushHistoryState({ search, category, filter }, 'Rentopia', `?${qs}`);
  }, [search, category, filter, activePage]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state) {
        setSearch(e.state.search || '');
        setCategory(e.state.category || '');
        setFilter(e.state.filter || { sort: 'best_match', minPrice: '', maxPrice: '', location: '' });
        setActivePage('home');
      }
    };
    return listenToEvent('popstate', handlePopState);
  }, []);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await apiFetch('/api/notifications');
        setNotifications(data);
      } catch { }
    }
    loadNotifications();
  }, []);

  const isSearching = !!(search || category);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        search={search}
        onSearchChange={setSearch}
        notifications={notifications}
        category={category}
        onSelectCategory={setCategory}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1">
        {activePage === 'home' && (
          <>
            <Categories selected={category} onSelect={setCategory} />

            {!isSearching && (
              <div className="px-4 py-4 max-w-7xl mx-auto w-full">
                <Banner />
              </div>
            )}

            <main className="max-w-7xl mx-auto px-4 pb-24 w-full">

              <div className="flex flex-col gap-6">
                {isSearching && (
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {search ? `Hasil untuk "${search}"` : `Kategori: ${category}`}
                      </h2>
                      <p className="text-sm text-gray-500">{items.length} produk ditemukan</p>
                    </div>
                    <button
                      onClick={() => setShowFilter(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all active:scale-95"
                    >
                      <SlidersHorizontal size={18} className="text-blue-600" />
                      Filter
                    </button>
                  </div>
                )}

                <div className="flex gap-6 items-start">
                  <Filter
                    isOpen={showFilter}
                    onClose={() => setShowFilter(false)}
                    onApply={setFilter}
                  />
                  <div className="flex-1 w-full">
                    <ItemList items={items} loading={loading} />
                  </div>
                </div>
              </div>
            </main>
          </>
        )}

        {activePage === 'upload' && (
          <div className="pb-12 bg-gray-50 min-h-screen">
            <UploadPage />
          </div>
        )}

        {activePage === 'profil' && (
          <div className="bg-gray-50 min-h-screen">
            <ProfilPage />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
