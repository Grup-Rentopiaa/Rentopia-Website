import { useState, useRef } from 'react'

export default function EditProfileForm({ user, onSave, onCancel }) {
  const [form, setForm] = useState({
    username:    user?.username    || '',
    name:        user?.name        || '',
    city:        user?.city        || '',
    description: user?.description || '',
    phone:       user?.phone       || '',
    avatarB64:   user?.avatarB64   || null,
  })
  const [preview,  setPreview]  = useState(user?.avatarB64 || null)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState(null)
  const fileRef = useRef()

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
    if (!form.username) return setError('Username wajib diisi.')
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  const inputClass = 'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
  const initials   = (user?.name || user?.username || '?')[0]?.toUpperCase()

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">{error}</p>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div onClick={() => fileRef.current.click()}
          className="relative cursor-pointer group shrink-0">
          {preview ? (
            <img src={preview} className="h-16 w-16 rounded-xl object-cover ring-2 ring-purple-100" alt="avatar" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-600 text-xl font-black text-white">
              {initials}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-bold text-white">Ganti</span>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
        <p className="text-xs text-slate-400">Klik foto untuk mengubah foto profil</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Username <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">@</span>
            <input name="username" value={form.username} onChange={handleChange}
              placeholder="username_kamu"
              className={`${inputClass} pl-7`} />
          </div>
          <p className="mt-1 text-[10px] text-slate-400">Hanya huruf, angka, dan underscore. Harus unik.</p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Nama Lengkap</label>
          <input name="name" value={form.name} onChange={handleChange}
            placeholder="Nama kamu atau nama toko" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Kota</label>
          <input name="city" value={form.city} onChange={handleChange}
            placeholder="Jakarta, Surabaya..." className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Nomor HP</label>
          <input name="phone" value={form.phone} onChange={handleChange}
            placeholder="08xxxxxxxxxx" className={inputClass} />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-500">Deskripsi</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Tentang kamu atau toko kamu..."
            rows={3}
            className={`${inputClass} resize-none`} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-40 transition-all">
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          Batal
        </button>
      </div>
    </form>
  )
}