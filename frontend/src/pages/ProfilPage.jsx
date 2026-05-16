import { useUser }     from '../hooks/useUser'
import { useItems }    from '../hooks/useItems'
import { useRentals }  from '../hooks/useRentals'
import { useProfile }  from '../hooks/useProfile'
import ItemCard        from './ItemCard'
import RentalCard      from './RentalCard'
import { useState, useEffect }    from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LogOut, UserPlus, UserMinus } from 'lucide-react'

// TEMP logged in user ID until full auth context is used
const LOGGED_IN_USER_ID = 1

export default function ProfilePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  // If no ID or ID matches logged in user, redirect to Dashboard
  useEffect(() => {
    if (!id || parseInt(id) === LOGGED_IN_USER_ID) {
      navigate('/dashboard', { replace: true })
    }
  }, [id, navigate])

  const profileId = id ? parseInt(id) : null
  const { profile: user, loading, error, isFollowing, followLoading, toggleFollow } = useProfile(profileId, LOGGED_IN_USER_ID)
  
  const { items }    = useItems(profileId)
  const { rentals }  = useRentals(profileId)
  const [tab, setTab] = useState('items')

  if (!profileId || profileId === LOGGED_IN_USER_ID) return null

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-400">Memuat profil...</p>
    </div>
  )

  if (error || !user) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm text-red-500">Gagal memuat profil atau pengguna tidak ditemukan.</p>
    </div>
  )

  const initials = (user?.name || user?.username || '?')[0].toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition-colors"
          >
            ← Kembali
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 font-black text-white">R</div>
            <span className="text-xl font-black tracking-tight text-purple-600 cursor-pointer" onClick={() => navigate('/home')}>Rentopia.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFollow}
              disabled={followLoading}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all
                ${isFollowing 
                  ? 'bg-white border-2 border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-500 hover:bg-red-50' 
                  : 'bg-purple-600 text-white shadow hover:bg-purple-700'
                } disabled:opacity-50`}
            >
              {isFollowing ? <><UserMinus size={16} /> Unfollow</> : <><UserPlus size={16} /> Follow</>}
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
                  className="h-24 w-24 rounded-2xl object-cover shadow-md ring-4 ring-purple-50"
                  alt="avatar"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-purple-600 text-3xl font-black text-white shadow-md ring-4 ring-purple-50">
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
                <p className="text-2xl font-black text-purple-600">{items.length}</p>
                <p className="text-xs font-semibold text-slate-500">Barang</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-black text-purple-600">{rentals.length}</p>
                <p className="text-xs font-semibold text-slate-500">Disewa</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-black text-purple-600">{user?.followers ?? 0}</p>
                <p className="text-xs font-semibold text-slate-500">Pengikut</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-black text-purple-600">{user?.following ?? 0}</p>
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
              tab === 'items' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-purple-600'
            }`}
          >
            Barang Dijual ({items.length})
          </button>
          <button
            onClick={() => setTab('rentals')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              tab === 'rentals' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-purple-600'
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