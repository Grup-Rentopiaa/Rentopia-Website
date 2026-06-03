import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

function HeroSection() {
  const navigate = useNavigate()
  const scrollTo = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col" style={{background: '#7C4DFF'}}>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-4" style={{background: 'rgba(255,255,255,0.12)', borderBottom: '1px solid rgba(255,255,255,0.15)'}}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{background: '#fff'}}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <ellipse cx="18" cy="21" rx="9" ry="7" fill="#E8E8E8"/>
              <ellipse cx="18" cy="19" rx="6" ry="4" fill="#fff"/>
              <circle cx="15" cy="17" r="2" fill="#2D1B69"/>
              <circle cx="21" cy="17" r="2" fill="#2D1B69"/>
              <circle cx="15.5" cy="16.5" r="0.8" fill="#fff"/>
              <circle cx="21.5" cy="16.5" r="0.8" fill="#fff"/>
              <ellipse cx="18" cy="20" rx="2" ry="1.2" fill="#FFB6C1"/>
              <ellipse cx="14" cy="21.5" rx="2.5" ry="1.2" fill="#FFB6C1"/>
              <ellipse cx="22" cy="21.5" rx="2.5" ry="1.2" fill="#FFB6C1"/>
              <path d="M8 10 Q6 3 13 6 Q15 7 13 12 Z" fill="#fff" stroke="#E0E0E0" strokeWidth="0.5"/>
              <path d="M28 10 Q30 3 23 6 Q21 7 23 12 Z" fill="#fff" stroke="#E0E0E0" strokeWidth="0.5"/>
              <path d="M8 10 Q6 3 13 6 Q15 7 13 12 Z" fill="#FFB6C1" opacity="0.5"/>
              <path d="M28 10 Q30 3 23 6 Q21 7 23 12 Z" fill="#FFB6C1" opacity="0.5"/>
            </svg>
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
      <div className="flex flex-1 items-end px-12 gap-8 py-12">

        {/* Kiri */}
        <div className="flex flex-col gap-5 w-1/2">
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

        {/* Kanan - Karakter */}
        <div className="flex-1 flex justify-center items-end">
          <svg width="340" height="420" viewBox="0 0 340 420">
            <ellipse cx="170" cy="405" rx="120" ry="14" fill="rgba(0,0,0,0.15)"/>
            <path d="M112 195 Q96 155 110 135 Q120 118 133 132 Q127 162 130 192 Z" fill="#fff" stroke="#E0E0E0" strokeWidth="1"/>
            <path d="M228 195 Q244 155 230 135 Q220 118 207 132 Q213 162 210 192 Z" fill="#fff" stroke="#E0E0E0" strokeWidth="1"/>
            <path d="M112 195 Q96 155 110 135 Q120 118 133 132 Q127 162 130 192 Z" fill="#FFB6C1" opacity="0.45"/>
            <path d="M228 195 Q244 155 230 135 Q220 118 207 132 Q213 162 210 192 Z" fill="#FFB6C1" opacity="0.45"/>
            <ellipse cx="170" cy="255" rx="70" ry="80" fill="#E8E8E8"/>
            <ellipse cx="170" cy="245" rx="64" ry="72" fill="#F0F0F0"/>
            <ellipse cx="170" cy="233" rx="52" ry="54" fill="#fff"/>
            <circle cx="152" cy="220" r="8.5" fill="#2D1B69"/>
            <circle cx="188" cy="220" r="8.5" fill="#2D1B69"/>
            <circle cx="154.5" cy="218" r="3.5" fill="#fff"/>
            <circle cx="190.5" cy="218" r="3.5" fill="#fff"/>
            <ellipse cx="170" cy="233" rx="7" ry="5" fill="#FFB6C1"/>
            <path d="M163 240 Q170 245 177 240" stroke="#E8956D" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <ellipse cx="154" cy="244" rx="10" ry="5.5" fill="#FFB6C1"/>
            <ellipse cx="186" cy="244" rx="10" ry="5.5" fill="#FFB6C1"/>
            <rect x="122" y="298" width="96" height="70" rx="28" fill="#7C4DFF"/>
            <rect x="128" y="304" width="84" height="58" rx="22" fill="#9C6FFF"/>
            <path d="M108 285 Q88 258 102 228 Q116 200 130 212 Q122 244 126 280 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
            <path d="M232 285 Q252 258 238 228 Q224 200 210 212 Q218 244 214 280 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
            <path d="M80 320 Q65 345 75 365 Q85 375 100 365 Q110 345 100 320 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
            <path d="M260 320 Q275 345 265 365 Q255 375 240 365 Q230 345 240 320 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
            <rect x="66" y="275" width="54" height="38" rx="12" fill="#fff" stroke="#E0E0E0" strokeWidth="1"/>
            <rect x="71" y="280" width="44" height="28" rx="8" fill="#F3EEFF"/>
            <text x="93" y="296" textAnchor="middle" fontSize="9" fill="#7C4DFF" fontWeight="800">KAMERA</text>
            <text x="93" y="306" textAnchor="middle" fontSize="8" fill="#9C6FFF">Rp25K/hari</text>
            <rect x="220" y="275" width="54" height="38" rx="12" fill="#fff" stroke="#E0E0E0" strokeWidth="1"/>
            <rect x="225" y="280" width="44" height="28" rx="8" fill="#FFF5E8"/>
            <text x="247" y="292" textAnchor="middle" fontSize="9" fill="#F4A261" fontWeight="800">Rp25.000</text>
            <circle cx="247" cy="302" r="6" fill="#4CAF50"/>
            <path d="M244 302 L246.5 304.5 L250 300" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

      </div>
    </div>
  )
}

export default HeroSection