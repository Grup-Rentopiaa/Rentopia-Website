import { useState, useRef } from 'react'
import { useUser }     from '../hooks/useUser'
import { useListings } from '../hooks/useListings'
import { useRentals }  from '../hooks/useRentals'
import ListingCard from './ListingCard'
import RentalCard  from './RentalCard'

const TEMP_USER_ID = 1

export default function DashboardPage() {
  const [tab,        setTab]        = useState('listings')
  const [showForm,   setShowForm]   = useState(false)
  const [editItem,   setEditItem]   = useState(null)
  const [form,       setForm]       = useState({ title: '', price: '', brand: '', status: 'available', image: null })
  const [preview,    setPreview]    = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [formError,  setFormError]  = useState(null)
  const fileRef = useRef()

  const { user, updateUser } = useUser()
  const { listings, loading: lLoad, create: createListing, update: updateListing, remove: removeListing, refresh: refreshListings } = useListings(TEMP_USER_ID)
  const { rentals,  loading: rLoad } = useRentals(TEMP_USER_ID)

  // ── Avatar upload ──────────────────────────────────────────────
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

  // ── Listing form ───────────────────────────────────────────────
  function openCreate() {
    setEditItem(null)
    setForm({ title: '', price: '', brand: '', status: 'available', image: null })
    setPreview(null)
    setFormError(null)
    setShowForm(true)
  }

  function openEdit(listing) {
    setEditItem(listing)
    setForm({ title: listing.title, price: listing.price, brand: listing.brand, status: listing.status, image: listing.image })
    setPreview(listing.image)
    setFormError(null)
    setShowForm(true)
  }

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleFormImage(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target.result)
      setForm(prev => ({ ...prev, image: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.price || !form.brand) return setFormError('Title, price, dan brand wajib diisi.')
    setSaving(true)
    try {
      if (editItem) {
        await updateListing(editItem.id, form)
      } else {
        await createListing(form)
      }
      await refreshListings()
      setShowForm(false)
    } catch (err) {
      setFormError(err.message)
    } finally { setSaving(false) }
  }

  const inputClass = 'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
  const initials   = (user?.name || user?.username || '?')[0]?.toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-white">R</div>
            <span className="text-xl font-black tracking-tight text-blue-600">Rentopia.</span>
          </div>
          <span className="text-sm font-semibold text-slate-500">Dashboard</span>
        </div>
      </nav>

      {/* PROFILE SECTION */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-screen-xl px-6 py-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">

            {/* Avatar — klik untuk ganti */}
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
            </div>

            {/* Stats */}
            <div className="flex gap-0 rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden shadow-sm">
              {[
                { label: 'Barang',    value: listings.length },
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

        {/* TABS */}
        <div className="mb-6 flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <button onClick={() => setTab('listings')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${tab === 'listings' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-blue-600'}`}>
            Barang Saya ({listings.length})
          </button>
          <button onClick={() => setTab('rentals')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${tab === 'rentals' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-blue-600'}`}>
            Sedang Saya Sewa ({rentals.length})
          </button>
        </div>

        {/* LISTINGS TAB */}
        {tab === 'listings' && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">Daftar Barang</h2>
              <button onClick={openCreate}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-all">
                + Tambah Barang
              </button>
            </div>

            {/* FORM TAMBAH / EDIT */}
            {showForm && (
              <form onSubmit={handleFormSubmit} className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-extrabold text-slate-900">
                  {editItem ? 'Edit Barang' : 'Tambah Barang Baru'}
                </h3>

                {formError && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">{formError}</p>}

                {/* Image Upload */}
                <div onClick={() => document.getElementById('listing-img').click()}
                  className="mb-4 flex h-40 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors overflow-hidden">
                  {preview ? (
                    <img src={preview} className="h-full w-full object-cover" alt="preview" />
                  ) : (
                    <div className="text-center">
                      <p className="text-3xl">📷</p>
                      <p className="text-xs text-slate-400 mt-1">Klik untuk upload foto produk</p>
                    </div>
                  )}
                </div>
                <input id="listing-img" type="file" accept="image/*" onChange={handleFormImage} className="hidden" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Nama Barang</label>
                    <input name="title" value={form.title} onChange={handleFormChange} placeholder="Tas Gucci GG Marmont..." className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Brand</label>
                    <input name="brand" value={form.brand} onChange={handleFormChange} placeholder="Gucci, Nike..." className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Harga Sewa</label>
                    <input name="price" value={form.price} onChange={handleFormChange} placeholder="Rp 75.000/hari" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Status</label>
                    <select name="status" value={form.status} onChange={handleFormChange} className={inputClass}>
                      <option value="available">Tersedia</option>
                      <option value="rented">Sedang Disewa</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button type="submit" disabled={saving}
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40 transition-all">
                    {saving ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Simpan Barang'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700">
                    Batal
                  </button>
                </div>
              </form>
            )}

            {lLoad ? (
              <p className="py-16 text-center text-sm text-slate-400">Memuat...</p>
            ) : listings.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-400">Belum ada barang. Klik "+ Tambah Barang" untuk mulai!</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {listings.map(l => (
                  <ListingCard
                    key={l.id}
                    listing={l}
                    onEdit={() => openEdit(l)}
                    onDelete={() => removeListing(l.id)}
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