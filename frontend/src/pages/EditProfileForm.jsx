import { useState } from 'react'
import { Save, X } from 'lucide-react'


export default function EditProfileForm({ user, onSave, onCancel }) {
  const [form, setForm] = useState({
    name:        user?.name        || '',
    city:        user?.city        || '',
    description: user?.description || '',
    phone:       user?.phone       || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: '#FFD6EC', color: '#9B4070' }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#7B6AAA' }}>Nama Lengkap</label>
          <input name="name" value={form.name} onChange={handleChange}
            placeholder="Nama atau nama toko" className="rp-input" />
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#7B6AAA' }}>Kota</label>
          <input name="city" value={form.city} onChange={handleChange}
            placeholder="Jakarta, Bandung..." className="rp-input" />
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#7B6AAA' }}>Nomor HP</label>
          <input name="phone" value={form.phone} onChange={handleChange}
            placeholder="08xxxxxxxxxx" className="rp-input" />
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#7B6AAA' }}>Deskripsi</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Ceritakan tentang kamu..." rows={2} className="rp-input resize-none" />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="rp-btn-outline flex-1 py-2.5 text-sm">
          <X size={14} /> Batal
        </button>
        <button type="submit" disabled={saving} className="rp-btn-primary flex-1 py-2.5 text-sm">
          <Save size={14} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  )
}