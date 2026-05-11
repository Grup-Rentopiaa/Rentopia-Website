import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser }     from '../hooks/useUser'
import { useItems }    from '../hooks/useItems'
import { useRentals }  from '../hooks/useRentals'
import ItemCard        from './ItemCard'
import RentalCard      from './RentalCard'
import EditProfileForm from './EditProfileForm'
import { LogOut }      from 'lucide-react'

// Using TEMP_USER_ID until full auth context is integrated
const TEMP_USER_ID = 1

export default function DashboardPage() {
  const navigate = useNavigate()

  // ── State ──────────────────────────────────────────────────────
  const [tab,             setTab]             = useState('items')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [search,          setSearch]          = useState('')
  const [filterCat,       setFilterCat]       = useState('')
  const fileRef = useRef()

  // ── Hooks ──────────────────────────────────────────────────────
  const { user, updateUser } = useUser()
  const { items, loading: iLoad, remove: removeItem } = useItems(TEMP_USER_ID)
  const { rentals, loading: rLoad } = useRentals(TEMP_USER_ID)

  // ── Avatar ─────────────────────────────────────────────────────
  function handleAvatarClick() { fileRef.current.click() }
  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      await updateUser({ avatarB64: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  // ── Logout ─────────────────────────────────────────────────────
  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  // ── Filter & search ────────────────────────────────────────────
  const filteredItems = items.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
                        (l.description || '').toLowerCase().includes(search.toLowerCase())
    const matchCat    = filterCat ? l.category_name === filterCat : true
    return matchSearch && matchCat
  })

  const categories = [...new Set(items.map(l => l.category_name).filter(Boolean))]

  // ── Helpers ────────────────────────────────────────────────────
  const initials   = (user?.name || user?.username || '?')[0]?.toUpperCase()

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-white">R</div>
            <span className="text-xl font-black tracking-tight text-blue-600 cursor-pointer" onClick={() => navigate('/home')}>Rentopia.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-500 hidden sm:block">Dashboard</span>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* PROFILE SECTION */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-screen-xl px-6 py-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">

            {/* Avatar */}
            <div className="relative shrink-0 cursor-pointer group" onClick={handleAvatarClick}>
              {user?.avatarB64 ? (
                <img src={user.avatarB64} className="h-24 w-24 rounded-2xl object-cover shadow-md ring-4 ring-blue-50" alt="avatar" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-black text-white shadow-md ring-4 ring-blue-50">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-white">Ganti Foto</span>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || user?.username}</h1>
              <p className="mt-0.5 text-sm text-slate-400">@{user?.username}</p>
              {user?.city        && <p className="mt-1 text-sm text-slate-500">📍 {user.city}</p>}
              {user?.phone       && <p className="mt-1 text-sm text-slate-500">📞 {user.phone}</p>}
              {user?.description && <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600">{user.description}</p>}
              <button
                onClick={() => setShowEditProfile(prev => !prev)}
                className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all"
              >
                {showEditProfile ? '✕ Batal Edit' : '✏️ Edit Profil'}
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-0 rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden shadow-sm">
              {[
                { label: 'Barang',    value: items.length },
                { label: 'Disewa',    value: rentals.length  },
                { label: 'Pengikut',  value: user?.followers ?? 0 },
                { label: 'Mengikuti', value: user?.following ?? 0 },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-stretch">
                  <div className="flex flex-col items-center justify-center px-5 py-4 text-center">
                    <p className="text-2xl font-black text-blue-600">{s.value}</p>
                    <p className="text-xs font-semibold text-slate-500">{s.label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="w-px bg-slate-200 my-3" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-6 py-8">

        {/* EDIT PROFILE FORM */}
        {showEditProfile && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-extrabold text-slate-900">Edit Profil</h3>
            <EditProfileForm
              user={user}
              onSave={async (data) => {
                await updateUser(data)
                setShowEditProfile(false)
              }}
              onCancel={() => setShowEditProfile(false)}
            />
          </div>
        )}

        {/* TABS */}
        <div className="mb-6 flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <button onClick={() => setTab('items')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${tab === 'items' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-blue-600'}`}>
            Barang Saya ({items.length})
          </button>
          <button onClick={() => setTab('rentals')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${tab === 'rentals' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-blue-600'}`}>
            Sedang Saya Sewa ({rentals.length})
          </button>
        </div>

        {/* ITEMS TAB */}
        {tab === 'items' && (
          <section>

            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">Daftar Barang</h2>
              <button onClick={() => navigate('/upload')}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-sm">
                + Tambah Barang
              </button>
            </div>

            {/* Search & Filter */}
            <div className="mb-5 flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari nama barang..."
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {categories.length > 0 && (
                <select
                  value={filterCat}
                  onChange={e => setFilterCat(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white text-slate-600 font-semibold cursor-pointer"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Item Cards */}
            {iLoad ? (
              <p className="py-16 text-center text-sm text-slate-400">Memuat...</p>
            ) : filteredItems.length === 0 && items.length > 0 ? (
              <p className="py-16 text-center text-sm text-slate-400">Tidak ada barang yang cocok.</p>
            ) : items.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-slate-400 mb-4">Belum ada barang yang diupload.</p>
                <button onClick={() => navigate('/upload')} className="rounded-xl bg-blue-50 border border-blue-200 text-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-100 transition-colors">Mulai Upload Produk</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {filteredItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => navigate(`/upload?edit=${item.id}`)}
                    onDelete={() => {
                      if (confirm('Yakin ingin menghapus barang ini?')) {
                        removeItem(item.id)
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* RENTALS TAB */}
        {tab === 'rentals' && (
          <section>
            <h2 className="mb-5 text-base font-extrabold text-slate-900">Sedang Disewa</h2>
            {rLoad ? (
              <p className="py-16 text-center text-sm text-slate-400">Memuat...</p>
            ) : rentals.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-400">Belum ada rental aktif.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {rentals.map(r => <RentalCard key={r.id} rental={r} />)}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  )
}