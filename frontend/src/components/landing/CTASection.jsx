import { Button } from '@/components/ui/button'

function CTASection() {
  return (
    <>
      {/* Screenshot App */}
      <section className="py-16 px-12" style={{background: '#7C4DFF'}}>
        <h2 className="font-black text-4xl text-white mb-2" style={{letterSpacing: '-1px'}}>
          Lihat aplikasinya
        </h2>
        <p className="text-sm mb-8" style={{color: 'rgba(255,255,255,0.7)'}}>
          Tersedia di iOS dan Android.
        </p>
        <div className="rounded-2xl flex flex-col items-center justify-center gap-3" style={{
          background: 'rgba(255,255,255,0.12)',
          border: '3px dashed rgba(255,255,255,0.3)',
          height: '280px'
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="rgba(255,255,255,0.2)"/>
            <rect x="10" y="6" width="20" height="28" rx="3" fill="rgba(255,255,255,0.4)"/>
            <circle cx="20" cy="30" r="2" fill="rgba(255,255,255,0.6)"/>
          </svg>
          <p className="text-sm font-semibold" style={{color: 'rgba(255,255,255,0.4)', margin: 0}}>
            Screenshot App
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-12 text-center" style={{background: '#1A1A2E'}}>
        <h2 className="font-black text-white mb-3" style={{fontSize: '44px', letterSpacing: '-1px', margin: 0}}>
          Mulai sekarang.<br/>
          <span style={{color: '#9C6FFF'}}>Gratis.</span>
        </h2>
        <p className="text-base mb-8" style={{color: 'rgba(255,255,255,0.5)'}}>
          Sewa atau sewakan — pilih kamu.
        </p>
        <div className="flex gap-3 justify-center">
          <Button className="rounded-full font-black px-10 py-6 text-base" style={{background: '#7C4DFF', color: '#fff'}}>
            Cari Barang
          </Button>
          <Button variant="outline" className="rounded-full px-10 py-6 text-base font-semibold text-white bg-transparent" style={{borderColor: 'rgba(255,255,255,0.3)'}}>
            Sewakan Barang
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-12 flex justify-between items-center" style={{background: '#13132A'}}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{background: '#7C4DFF'}}>
            <svg width="28" height="28" viewBox="0 0 28 28">
              <ellipse cx="14" cy="17" rx="8" ry="6" fill="#F0F0F0"/>
              <ellipse cx="14" cy="15" rx="7" ry="5" fill="#fff"/>
              <circle cx="11" cy="13" r="1.5" fill="#2D1B69"/>
              <circle cx="17" cy="13" r="1.5" fill="#2D1B69"/>
            </svg>
          </div>
          <span className="text-sm font-bold" style={{color: 'rgba(255,255,255,0.4)'}}>Rentopia</span>
        </div>
        <p className="text-xs" style={{color: 'rgba(255,255,255,0.2)', margin: 0}}>© 2025 Rentopia</p>
      </footer>
    </>
  )
}

export default CTASection