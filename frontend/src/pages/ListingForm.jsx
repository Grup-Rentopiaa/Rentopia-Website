import { useState, useRef } from 'react'

const EMPTY = { icon: '👜', title: '', price: '', brand: '', status: 'available', image: null }

export default function ListingForm({ onSubmit, onCancel }) {
  const [form,    setForm]    = useState(EMPTY)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const fileRef = useRef()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleImage(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target.result)
      setForm(prev => ({ ...prev, image: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.price || !form.brand) {
      return setError('Title, price, dan brand wajib diisi.')
    }
    setLoading(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const inputClass = 'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-extrabold text-slate-900">Tambah Barang Baru</h3>

      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">{error}</p>}

      {/* Image Upload */}
      <div
        onClick={() => fileRef.current.click()}
        className="mb-4 flex h-36 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 hover:border-purple-400 transition-colors overflow-hidden"
      >
        {preview ? (
          <img src={preview} className="h-full w-full object-cover" alt="preview" />
        ) : (
          <div className="text-center">
            <p className="text-2xl">📷</p>
            <p className="text-xs text-slate-400 mt-1">Klik untuk upload foto</p>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Icon</label>
          <input name="icon" value={form.icon} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Brand</label>
          <input name="brand" value={form.brand} onChange={handleChange} placeholder="Nike, Gucci..." className={inputClass} />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-500">Nama Barang</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Tas Gucci GG Marmont..." className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Harga Sewa</label>
          <input name="price" value={form.price} onChange={handleChange} placeholder="Rp 75.000/hari" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            <option value="available">Tersedia</option>
            <option value="rented">Sedang Disewa</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={loading}
          className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-40 transition-all">
          {loading ? 'Menyimpan...' : 'Simpan Barang'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          Batal
        </button>
      </div>
    </form>
  )
}