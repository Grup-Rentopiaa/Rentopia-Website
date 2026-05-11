import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { user, loading, updateUser } = useUser()
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState(null)
  const [preview,  setPreview]  = useState(null)
  const fileRef = useRef()

  const [form, setForm] = useState({
    name:        user?.name        || '',
    city:        user?.city        || '',
    description: user?.description || '',
    phone:       user?.phone       || '',
    avatarB64:   user?.avatarB64   || null,
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleAvatar(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target.result)
      setForm(prev => ({ ...prev, avatarB64: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await updateUser(form)
      setSuccess(true)
      setTimeout(() => navigate('/profile'), 1000)
    } catch (err) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  const inputClass = 'w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
  const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500'

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-slate-400">Memuat...</p>
    </div>
  )

  const initials = (user?.name || user?.username || '?')[0].toUpperCase()
  const avatarSrc = preview || user?.avatarB64

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/profile')}
            className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            ← Batal
          </button>
          <span className="text-sm font-extrabold text-slate-900">Edit Profil</span>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40 transition-all"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-lg px-6 py-10">

        {success && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
            ✅ Profil berhasil disimpan!
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Avatar Upload */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div
            onClick={() => fileRef.current.click()}
            className="relative cursor-pointer group"
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                className="h-24 w-24 rounded-2xl object-cover shadow-md ring-4 ring-blue-50"
                alt="avatar"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-black text-white shadow-md ring-4 ring-blue-50">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-bold text-white">Ganti Foto</span>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
          <p className="text-xs text-slate-400">Klik foto untuk mengubah</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>Nama Lengkap</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Nama kamu atau nama toko" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Kota</label>
            <input name="city" value={form.city} onChange={handleChange}
              placeholder="Jakarta, Surabaya, Bandung..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Nomor HP</label>
            <input name="phone" value={form.phone} onChange={handleChange}
              placeholder="08xxxxxxxxxx" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Deskripsi</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Ceritakan tentang kamu atau toko kamu..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
        </form>
      </div>
    </div>
  )
}