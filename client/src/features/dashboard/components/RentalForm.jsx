import { useState } from 'react'

const EMPTY = { icon: '📦', title: '', price: '', store: '', status: 'ongoing', note: '' }

export default function RentalForm({ onSubmit, onCancel }) {
  const [form,    setForm]    = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.price || !form.store) {
      return setError('Title, price, dan store wajib diisi.')
    }
    setLoading(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const inputClass = 'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-extrabold text-slate-900">Tambah Rental Baru</h3>

      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Icon</label>
          <input name="icon" value={form.icon} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Toko/Tempat Sewa</label>
          <input name="store" value={form.store} onChange={handleChange} placeholder="Nama toko..." className={inputClass} />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-500">Nama Barang</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Kamera Canon EOS..." className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Harga Sewa</label>
          <input name="price" value={form.price} onChange={handleChange} placeholder="Rp 50.000/hari" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            <option value="ongoing">Aktif</option>
            <option value="urgent">Mendesak</option>
            <option value="done">Selesai</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-500">Catatan (opsional)</label>
          <input name="note" value={form.note} onChange={handleChange} placeholder="Catatan tambahan..." className={inputClass} />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={loading}
          className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40 transition-all">
          {loading ? 'Menyimpan...' : 'Simpan Rental'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          Batal
        </button>
      </div>
    </form>
  )
}