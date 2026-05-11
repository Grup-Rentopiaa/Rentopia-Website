import { useUser }     from '../hooks/useUser'
import { useItems }    from '../hooks/useItems'
import { useRentals }  from '../hooks/useRentals'
import ItemCard        from './ItemCard'
import RentalCard      from './RentalCard'
import { useState }    from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut }      from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, loading, userId } = useUser()
  const { items }    = useItems(userId)
  const { rentals }  = useRentals(userId)
  const [tab, setTab] = useState('items')

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-400">Memuat profil...</p>
    </div>
  )

  const initials = (user?.name || user?.username || '?')[0].toUpperCase()

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            ← Kembali
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-white">R</div>
            <span className="text-xl font-black tracking-tight text-blue-600 cursor-pointer" onClick={() => navigate('/home')}>Rentopia.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/edit-profile')}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all hidden sm:block"
            >
              Edit Profil
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* PROFILE HERO */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-screen-xl px-6 py-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">

            {/* Avatar */}
            <div className="relative shrink-0">
              {user?.avatarB64 ? (
                <img
                  src={user.avatarB64}
                  className="h-24 w-24 rounded-2xl object-cover shadow-md ring-4 ring-blue-50"
                  alt="avatar"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-black text-white shadow-md ring-4 ring-blue-50">
                  {initials}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {user?.name || user?.username}
              </h1>
              <p className="mt-1 text-sm text-slate-500">@{user?.username}</p>
              {user?.city && (
                <p className="mt-1 text-sm text-slate-500">📍 {user.city}</p>
              )}
              {user?.phone && (
                <p className="mt-1 text-sm text-slate-500">📞 {user.phone}</p>
              )}
              {user?.description && (
                <p className="mt-3 max-w-lg text-sm text-slate-600 leading-relaxed">
                  {user.description}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 shadow-sm">
              <div className="text-center">
                <p className="text-2xl font-black text-blue-600">{items.length}</p>
                <p className="text-xs font-semibold text-slate-500">Barang</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-black text-blue-600">{rentals.length}</p>
                <p className="text-xs font-semibold text-slate-500">Disewa</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-black text-blue-600">{user?.followers ?? 0}</p>
                <p className="text-xs font-semibold text-slate-500">Pengikut</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-black text-blue-600">{user?.following ?? 0}</p>
                <p className="text-xs font-semibold text-slate-500">Mengikuti</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mx-auto max-w-screen-xl px-6 py-8">
        <div className="mb-6 flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <button
            onClick={() => setTab('items')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              tab === 'items' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            Barang Dijual ({items.length})
          </button>
          <button
            onClick={() => setTab('rentals')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              tab === 'rentals' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            Sedang Disewa ({rentals.length})
          </button>
        </div>

        {tab === 'items' && (
          items.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">Belum ada barang.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map(l => <ItemCard key={l.id} item={l} />)}
            </div>
          )
        )}

        {tab === 'rentals' && (
          rentals.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">Belum ada rental.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {rentals.map(r => <RentalCard key={r.id} rental={r} />)}
            </div>
          )
        )}
      </div>
    </div>
  )
}