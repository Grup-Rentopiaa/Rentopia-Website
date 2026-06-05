import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

function HeroSection() {
  const navigate = useNavigate()
  const scrollTo = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{background: '#7C4DFF', display: 'flex', flexDirection: 'column'}}>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-4" style={{background: 'rgba(255,255,255,0.12)', borderBottom: '1px solid rgba(255,255,255,0.15)'}}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{background: '#fff'}}>
            <img src="/logo.png" alt="Logo" className="w-5" />
          </div>
          <span className="font-black text-xl text-white" style={{letterSpacing: '-0.5px'}}>Rentopia</span>
        </div>

        <div className="flex gap-7 text-sm font-medium" style={{color: 'rgba(255,255,255,0.9)'}}>
          <span className="cursor-pointer hover:text-white" onClick={() => scrollTo('how-it-works')}>About</span>
          <span className="cursor-pointer hover:text-white" onClick={() => navigate('/upload')}>Sewakan</span>
          <span className="cursor-pointer hover:text-white">Harga</span>
          <span className="cursor-pointer hover:text-white">Tentang</span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/login')} className="rounded-full text-white border-white/50 hover:bg-white/20 bg-white/20">
            Masuk
          </Button>
          <Button onClick={() => navigate('/register')} className="rounded-full font-black" style={{background: '#fff', color: '#7C4DFF'}}>
            Daftar Gratis
          </Button>
        </div>
      </nav>

      {/* Hero Content */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>

        {/* Kiri */}
        <div style={{
          width: '38%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          justifyContent: 'center',
          padding: '48px',
        }}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold text-white w-fit" style={{background: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.5)'}}>
            Platform Sewa Barang #1 Indonesia
          </div>

          <h1 className="font-black text-white" style={{fontSize: '52px', lineHeight: '1.05', letterSpacing: '-2px', margin: 0}}>
            Sewa barang.<br/>Tanpa beli.
          </h1>

          <p className="text-base leading-relaxed" style={{color: 'rgba(255,255,255,0.85)', maxWidth: '380px'}}>
            Sewa dari sesama — kamera, laptop, tenda, dan ribuan barang lain. Mulai dari Rp25.000/hari.
          </p>

          <div className="flex gap-3">
            <Button onClick={() => navigate('/home')} className="rounded-full font-black px-9 py-6 text-base" style={{background: '#fff', color: '#7C4DFF'}}>
              Cari Barang
            </Button>
            <Button onClick={() => navigate('/register')} variant="outline" className="rounded-full px-7 py-6 text-base font-semibold text-white border-white/50 hover:bg-white/20 bg-transparent">
              Sewakan Barangmu
            </Button>
          </div>

          <div className="flex gap-5">
            {['Tanpa deposit', 'Terverifikasi', 'Bisa diantar'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-xs" style={{color: 'rgba(255,255,255,0.7)'}}>
                <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/><path d="M4 7 L6 9 L10 5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Kanan - Hero Banner full tanpa crop */}
<div style={{
  width: '62%',
  flexShrink: 0,
  margin: 0,
  padding: 0,
  lineHeight: 0,
  position: 'relative',
}}>
  {/* Gradasi dari kiri */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%',
    height: '100%',
    background: 'linear-gradient(to right, #7C4DFF, transparent)',
    zIndex: 1,
  }} />
  <img
    src="/banner-hero.png"
    alt="Rentopia Hero Banner"
    style={{
      width: '100%',
      height: 'auto',
      display: 'block',
    }}
  />
</div>

      </div>
    </div>
  )
}

export default HeroSection