import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Package } from 'lucide-react';
import { getLikedItemsService } from '../services/itemService';
import ItemCard from './ItemCard';

export default function WishlistPage({ setActivePage }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
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
      </div>

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
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-gray-200" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Wishlist Kosong</h3>
          <p className="text-gray-500 mb-6">Anda belum menyukai produk apa pun.</p>
          <button onClick={() => setActivePage('home')} className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-colors">
            Cari Produk
          </button>
        </div>
      )}
    </div>
  );
}
