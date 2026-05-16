import { useState, useEffect } from 'react';
import { SlidersHorizontal, MapPin, Users, TrendingUp, Grid } from 'lucide-react';
import apiFetch from '../api';
import useProducts from '../hooks/useProducts';
import { pushHistoryState, listenToEvent } from '../utils/Features';

import HomepageNavbar from '../components/HomepageNavbar';
import Categories from '../components/Categories';
import Filter from '../components/Filter';
import ItemList from '../components/ItemList';
import Banner from '../components/Banner';
import HomepageFooter from '../components/HomepageFooter';
import UploadPage from './UploadPage';
import ProfilPage from './ProfilPage';
import ChatPage from './ChatPage';
import OfferPage from './OfferPage';
import WishlistPage from './WishlistPage';

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [activePage, setActivePage] = useState('home');
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('produk'); // 'produk' or 'pengguna'
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [category, setCategory] = useState('');
  const [recommendTab, setRecommendTab] = useState('semua');
  const [filter, setFilter] = useState({
    sort: 'random', minPrice: '', maxPrice: '', location: '',
  });
  const [notifications, setNotifications] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const isSearching = !!(search || category);

  useEffect(() => {
    if (searchType === 'pengguna' && search) {
      apiFetch(`/api/users?search=${encodeURIComponent(search)}`)
        .then(data => setSearchedUsers(data))
        .catch(() => setSearchedUsers([]));
    } else {
      setSearchedUsers([]);
    }
  }, [search, searchType]);

  // Sync recommendation tab with filter
  useEffect(() => {
    if (recommendTab === 'semua') setFilter(prev => ({ ...prev, sort: 'random', filter: null }));
    if (recommendTab === 'terdekat') setFilter(prev => ({ ...prev, sort: 'nearest', filter: null }));
    if (recommendTab === 'diikuti') setFilter(prev => ({ ...prev, sort: 'random', filter: 'following' }));
    if (recommendTab === 'trending') setFilter(prev => ({ ...prev, sort: 'trending', filter: null }));
  }, [recommendTab]);

  // Refresh items when a like status changes elsewhere
  useEffect(() => {
    const handler = () => {
      // Force filter object to new reference to trigger useProducts reload
      setFilter(prev => ({ ...prev }));
    };
    window.addEventListener('likeChanged', handler);
    return () => window.removeEventListener('likeChanged', handler);
  }, []);

  const { items, loading } = useProducts(search, category, filter, user?.id);

  
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
        setFilter(e.state.filter || { sort: 'random', minPrice: '', maxPrice: '', location: '' });
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



  const RECOMMEND_TABS = [
    { id: 'semua', label: 'Semua', Icon: Grid },
    { id: 'terdekat', label: 'Terdekat', Icon: MapPin },
    { id: 'diikuti', label: 'Diikuti', Icon: Users },
    { id: 'trending', label: 'Paling Atas', Icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HomepageNavbar
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
            
            <main className="max-w-7xl mx-auto px-4 pb-24 w-full pt-6">
              {!isSearching && (
                <>
                  <Banner />
                  
                  {/* Recommendation Tabs */}
                  <div className="mt-8 mb-6 flex flex-wrap items-center gap-2">
                    {RECOMMEND_TABS.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        onClick={() => setRecommendTab(id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95
                          ${recommendTab === id 
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}
                        `}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="flex flex-col gap-6">
                {isSearching && (
                  <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {search ? `Hasil pencarian untuk "${search}"` : `Kategori: ${category}`}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {searchType === 'produk' ? `${items.length} produk ditemukan` : `${searchedUsers.length} pengguna ditemukan`}
                      </p>
                    </div>
                    
                    {/* Toggle Search Type */}
                    {search && (
                      <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button 
                          onClick={() => setSearchType('produk')}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${searchType === 'produk' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`}
                        >
                          Produk
                        </button>
                        <button 
                          onClick={() => setSearchType('pengguna')}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${searchType === 'pengguna' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`}
                        >
                          Pengguna
                        </button>
                      </div>
                    )}

                    {searchType === 'produk' && (
                      <button
                        onClick={() => setShowFilter(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all active:scale-95"
                      >
                        <SlidersHorizontal size={18} className="text-purple-600" />
                        Filter
                      </button>
                    )}
                  </div>
                )}
                <div className="flex gap-6 items-start">
                  {searchType === 'produk' && <Filter isOpen={showFilter} onClose={() => setShowFilter(false)} onApply={setFilter} />}
                  <div className="flex-1 w-full">
                    {searchType === 'produk' ? (
                      <ItemList items={items} loading={loading} />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {searchedUsers.length > 0 ? searchedUsers.map(u => (
                          <div key={u.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                            {u.avatarB64 ? (
                              <img src={u.avatarB64} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {u.username[0].toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-bold text-gray-900">{u.name || u.username}</p>
                              <p className="text-xs text-gray-500">@{u.username}</p>
                              <p className="text-[10px] text-purple-600 font-semibold mt-1">{u.followers} Pengikut</p>
                            </div>
                            <button className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors">
                              Lihat
                            </button>
                          </div>
                        )) : (
                          <p className="text-gray-400 text-sm py-8 col-span-full text-center">Pengguna tidak ditemukan.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </>
        )}

        {activePage === 'wishlist' && (
          <WishlistPage setActivePage={setActivePage} />
        )}

        {activePage === 'chat' && (
          <div className="bg-gray-50 min-h-screen">
            <ChatPage setActivePage={setActivePage} />
          </div>
        )}
        {activePage === 'offer' && (
          <div className="bg-gray-50 min-h-screen">
            <OfferPage setActivePage={setActivePage} />
          </div>
        )}
      </div>

      <HomepageFooter />
    </div>
  );
}