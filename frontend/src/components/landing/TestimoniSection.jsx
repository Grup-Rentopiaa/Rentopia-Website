import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

function TestimoniSection() {
  const reviews = [
    { name: 'Dinda R.', city: 'Jakarta', text: '"Kamera kondisi bagus. Prosesnya cepat dan mudah."' },
    { name: 'Aldi S.', city: 'Bandung', text: '"Tenda camping lengkap, harga jauh lebih murah dari beli."' },
    { name: 'Maya P.', city: 'Surabaya', text: '"Laptop persis seperti di foto. Bisa dipercaya."' }
  ]

  return (
    <section className="py-16 px-12" style={{background: '#fff'}}>
      <h2 className="font-black text-4xl mb-2" style={{color: '#1A1A2E', letterSpacing: '-1px'}}>
        Apa kata mereka
      </h2>
      <p className="text-sm mb-10" style={{color: '#888'}}>Lebih dari 8.000 pengguna aktif.</p>

      <div className="grid grid-cols-3 gap-4">
        {reviews.map(r => (
          <Card key={r.name} className="rounded-2xl" style={{background: '#F8F4FF', border: '2px solid #7C4DFF'}}>
            <CardContent className="p-6">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{color: '#FFD700', fontSize: '13px'}}>★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{color: '#333'}}>{r.text}</p>
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="font-black text-sm text-white" style={{background: '#7C4DFF'}}>
                    {r.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-black" style={{color: '#1A1A2E', margin: 0}}>{r.name}</p>
                  <p className="text-xs" style={{color: '#888', margin: 0}}>{r.city}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default TestimoniSection