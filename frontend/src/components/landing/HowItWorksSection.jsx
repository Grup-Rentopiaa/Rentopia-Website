import { Card, CardContent } from '@/components/ui/card'

function HowItWorksSection() {
  const steps = [
    {
      title: 'Butuh barang tapi ga mau beli?',
      desc: 'Cuma dipakai hari ini aja, masa beli sih.',
      img: '/ilustrasi1.png',
      color: '#7C4DFF'
    },
    {
      title: 'Punya barang yang jarang dipakai?',
      desc: 'Sewain di Rentopia aja kali ya, siapa tau ada yang butuh :D.',
      img: '/ilustrasi2.png',
      color: '#F4A261'
    },
    {
      title: 'Deal, langsung COD aja',
      desc: 'Win-win solution!',
      img: '/ilustrasi3.png',
      color: '#2ECC71'
    }
  ]

  return (
    <section id="how-it-works" className="py-16 px-12" style={{background: '#F8F4FF'}}>
      <h2 className="font-black text-4xl mb-3" style={{color: '#1A1A2E', letterSpacing: '-1px'}}>
        Barang nganggur? <span style={{color: '#7C4DFF'}}>Jadi cuan.</span>
      </h2>
      <p className="text-base mb-12" style={{color: '#888'}}>
        Sewakan barang yang jarang dipakai. Atur harga sendiri, terima pembayaran langsung.
      </p>

      <div className="grid grid-cols-3 gap-5">
        {steps.map(s => (
          <Card key={s.title} className="rounded-2xl overflow-hidden" style={{border: `2.5px solid ${s.color}`}}>
            <CardContent className="p-0 flex flex-col">
              <div className="p-6 pb-3">
                <h3 className="font-black text-base mb-1 leading-snug" style={{color: '#1A1A2E'}}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{color: '#666'}}>{s.desc}</p>
              </div>
              <div className="flex justify-center items-center flex-1 px-4 pb-4">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full object-contain"
                  style={{maxHeight: '240px'}}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default HowItWorksSection