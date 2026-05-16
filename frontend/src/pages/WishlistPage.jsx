import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Package, Trash2, Search, Filter } from 'lucide-react';
import { getLikedItemsService, clearLikedItemsService } from '../services/itemService';
import ItemCard from './ItemCard';

export default function WishlistPage({ setActivePage }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [clearing, setClearing] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (user) {
      fetchLikedItems();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      fetchLikedItems();
    };
    window.addEventListener('likeChanged', handler);
    return () => window.removeEventListener('likeChanged', handler);
  }, []);

  const fetchLikedItems = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getLikedItemsService(user.id);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus semua produk dari wishlist?")) return;
    setClearing(true);
    try {
      await clearLikedItemsService(user.id);
      setItems([]);
      window.dispatchEvent(new CustomEvent('likeChanged'));
    } catch (err) {
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = category ? item.category_name === category : true;
    return matchSearch && matchCategory;
  });


  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <Heart size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Login</h2>
          <p className="text-gray-500 mb-6">Silakan login untuk melihat wishlist Anda.</p>
          <button onClick={() => window.location.href = '/login'} className="primary-pill-button w-full">Login Sekarang</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setActivePage('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Wishlist Saya</h1>
          <p className="text-sm text-gray-500">{items.length} produk yang Anda sukai</p>
        </div>
        
        {items.length > 0 && (
          <button 
            onClick={handleClearAll}
            disabled={clearing}
            className="ml-auto flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Trash2 size={16} />
            {clearing ? 'Menghapus...' : 'Hapus Semua'}
          </button>
        )}
      </div>

      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari di wishlist..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-500 transition-colors appearance-none"
            >
              <option value="">Semua Kategori</option>
              {Array.from(new Set(items.map(i => i.category_name).filter(Boolean))).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-2xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-200" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Tidak Ditemukan</h3>
          <p className="text-gray-500 mb-6">Tidak ada produk di wishlist yang cocok dengan pencarian Anda.</p>
          <button onClick={() => { setSearch(''); setCategory(''); }} className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-purple-700 transition-colors">
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-gray-200" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Wishlist Kosong</h3>
          <p className="text-gray-500 mb-6">Anda belum menyukai produk apa pun.</p>
          <button onClick={() => setActivePage('home')} className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-purple-700 transition-colors">
            Cari Produk
          </button>
        </div>
      )}
    </div>
  );
}
