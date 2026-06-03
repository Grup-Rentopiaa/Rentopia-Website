import { Separator } from '@/components/ui/separator'

function StatsSection() {
  const stats = [
    { num: '15rb+', label: 'Produk tersedia' },
    { num: '8rb+', label: 'Pengguna aktif' },
    { num: '4.9★', label: 'Rating rata-rata' },
    { num: '50+', label: 'Kota jangkauan' }
  ]

  return (
    <section className="py-10 px-12" style={{background: '#fff'}}>
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.num} className="rounded-2xl p-5 text-center" style={{background: '#F3EEFF', border: '2.5px solid #7C4DFF'}}>
            <p className="font-black mb-1" style={{fontSize: '28px', color: '#7C4DFF', margin: 0}}>{s.num}</p>
            <p className="text-xs font-medium" style={{color: '#666', margin: 0}}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsSection