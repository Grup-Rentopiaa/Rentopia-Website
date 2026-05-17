import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Package, ShoppingBag, Edit2, Camera, Plus } from 'lucide-react';
import { useUser }    from '../hooks/useUser';
import { useItems }   from '../hooks/useItems';
import { useRentals } from '../hooks/useRentals';
import EditProfileForm from './EditProfileForm';
import apiFetch from '../api';

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab]               = useState('items');
  const [showEdit, setShowEdit]     = useState(false);
  const [search, setSearch]         = useState('');
  const fileRef = useRef();

  const { user, updateUser, userId } = useUser();
  const { items,   loading: iLoad }  = useItems(userId);
  const { rentals, loading: rLoad }  = useRentals(userId);

  function handleLogout() {
    if (userId) localStorage.removeItem(`rentopia_wishlist_${userId}`);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    fetch('http://localhost:3000/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    navigate('/', { replace: true });
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => { await updateUser({ avatarB64: ev.target.result }); };
    reader.readAsDataURL(file);
  }

  const filteredItems = items.filter(i => i.title?.toLowerCase().includes(search.toLowerCase()));
  const categories    = [...new Set(items.map(i => i.category_name).filter(Boolean))];
  const initials      = (user?.name || user?.username || '?')[0]?.toUpperCase();

  const StatBox = ({ label, value }) => (
    <div className="flex flex-col items-center px-5 py-4">
      <p className="text-2xl font-black" style={{ color: "#9B87D9" }}>{value}</p>
      <p className="text-xs font-semibold mt-0.5" style={{ color: "#A89CC4" }}>{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      {/* Navbar */}
      <nav className="rp-navbar">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/home')} className="rp-back-btn">
              <ArrowLeft size={16} /> Beranda
            </button>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)" }}>R</div>
            <span className="font-black text-lg hidden sm:block" style={{ color: "#9B87D9" }}>Rentopia</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors" style={{ background: "#FFD6EC", color: "#9B4070" }}>
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </nav>

      {/* Profile Section */}
      <div className="border-b" style={{ borderColor: "#E8DCFF", background: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative group cursor-pointer flex-shrink-0" onClick={() => fileRef.current?.click()}>
              {user?.avatarB64 ? (
                <img src={user.avatarB64} className="w-24 h-24 rounded-2xl object-cover" style={{ border: "3px solid #E8DCFF" }} alt="avatar" />
              ) : (
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black" style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)", color: "#3D2F6B", border: "3px solid #E8DCFF" }}>
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.3)" }}>
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-black" style={{ color: "#3D2F6B" }}>{user?.name || user?.username}</h1>
              <p className="text-sm mt-0.5" style={{ color: "#A89CC4" }}>@{user?.username}</p>
              {user?.city && <p className="text-sm mt-1" style={{ color: "#7B6AAA" }}>📍 {user.city}</p>}
              {user?.description && <p className="text-sm mt-2 max-w-md leading-relaxed" style={{ color: "#7B6AAA" }}>{user.description}</p>}
              <button onClick={() => setShowEdit(p => !p)} className="rp-btn-outline text-sm px-4 py-2 mt-4">
                <Edit2 size={14} /> {showEdit ? 'Batal Edit' : 'Edit Profil'}
              </button>
            </div>

            {/* Stats */}
            <div className="flex rounded-2xl overflow-hidden" style={{ border: "1px solid #E8DCFF", background: "#FAF8FF" }}>
              {[
                { label: 'Barang',   value: items.length },
                { label: 'Disewa',   value: rentals.length },
                { label: 'Pengikut', value: user?.followers ?? 0 },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-stretch">
                  <StatBox {...s} />
                  {i < arr.length - 1 && <div className="w-px my-3" style={{ background: "#E8DCFF" }} />}
                </div>
              ))}
            </div>
          </div>

          {showEdit && (
            <div className="mt-6 rp-card p-6">
              <h3 className="font-black mb-4" style={{ color: "#3D2F6B" }}>Edit Profil</h3>
              <EditProfileForm
                user={user}
                onSave={async data => { await updateUser(data); setShowEdit(false); }}
                onCancel={() => setShowEdit(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1.5 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E8DCFF" }}>
          {[
            { id: 'items',   label: `Barang Saya (${items.length})`,   icon: <Package size={15} /> },
            { id: 'rentals', label: `Sedang Disewa (${rentals.length})`, icon: <ShoppingBag size={15} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: tab === t.id ? "linear-gradient(135deg, #C9B8FF, #B09FEF)" : "transparent",
                color: tab === t.id ? "#3D2F6B" : "#A89CC4"
              }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {tab === 'items' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black" style={{ color: "#3D2F6B" }}>Daftar Barang</h2>
              <button onClick={() => navigate('/upload')} className="rp-btn-primary text-sm px-4 py-2">
                <Plus size={15} /> Tambah
              </button>
            </div>
            <div className="mb-4">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari barang..." className="rp-input text-sm" />
            </div>
            {iLoad ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array(4).fill(0).map((_, i) => <div key={i} className="rp-skeleton h-40 rounded-2xl" />)}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rp-card py-16 text-center">
                <div className="text-5xl mb-3">📦</div>
                <p className="font-bold" style={{ color: "#3D2F6B" }}>Belum ada barang</p>
                <button onClick={() => navigate('/upload')} className="rp-btn-primary mt-4 text-sm">Upload Produk</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map(item => (
                  <div key={item.id} className="rp-product-card cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                    <div className="aspect-square overflow-hidden" style={{ background: "#E8DCFF" }}>
                      {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold line-clamp-1" style={{ color: "#3D2F6B" }}>{item.title}</h3>
                      <p className="text-sm font-black mt-0.5" style={{ color: "#9B87D9" }}>
                        {formatPrice(item.price_per_day || item.price)}<span className="text-xs font-normal" style={{ color: "#A89CC4" }}>/hari</span>
                      </p>
                      <span className="rp-badge rp-badge-mint mt-1.5 text-[10px]">{item.status || 'Tersedia'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === 'rentals' && (
          <section>
            <h2 className="font-black mb-4" style={{ color: "#3D2F6B" }}>Barang Sedang Disewa</h2>
            {rLoad ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, i) => <div key={i} className="rp-skeleton h-40 rounded-2xl" />)}
              </div>
            ) : rentals.length === 0 ? (
              <div className="rp-card py-16 text-center">
                <div className="text-5xl mb-3">🛍️</div>
                <p className="font-bold" style={{ color: "#3D2F6B" }}>Belum ada rental aktif</p>
                <button onClick={() => navigate('/home')} className="rp-btn-primary mt-4 text-sm">Cari Produk</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rentals.map(r => (
                  <div key={r.id} className="rp-card p-4 flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#E8DCFF" }}>
                      {r.image ? <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm line-clamp-1" style={{ color: "#3D2F6B" }}>{r.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "#9B87D9" }}>{formatPrice(r.price)}/hari</p>
                      <p className="text-xs mt-0.5" style={{ color: "#A89CC4" }}>dari: {r.store}</p>
                      <span className="rp-badge rp-badge-blue mt-1.5 text-[10px]">Aktif</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}