import { useNavigate } from "react-router-dom"
import { Button } from '@/components/ui/button'
import AppNavbar from "../components/AppNavbar"

function LandingNavbar() {
  const navigate = useNavigate()
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <nav className="flex justify-between items-center px-12 py-4" style={{ background: '#7C4DFF', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#fff' }}>
          <img src="/logo.png" alt="Logo" className="w-5" />
        </div>
        <span className="font-black text-xl text-white" style={{ letterSpacing: '-0.5px' }}>Rentopia</span>
      </div>
      <div className="flex gap-7 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
        <span className="cursor-pointer hover:text-white" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Get Started</span>
        <span className="cursor-pointer hover:text-white" onClick={() => scrollTo('how-it-works')}>About</span>
        <span className="cursor-pointer hover:text-white" onClick={() => scrollTo('reviews')}>Review</span>
        <span className="cursor-pointer hover:text-white" onClick={() => scrollTo('how-to-rent')}>How to Rent</span>
        <span className="cursor-pointer hover:text-white" onClick={() => scrollTo('contact')}>Contact</span>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate('/login')} className="rounded-full text-white border-white/50 hover:bg-white/20 bg-white/20">Masuk</Button>
        <Button onClick={() => navigate('/register')} className="rounded-full font-black" style={{ background: '#fff', color: '#7C4DFF' }}>Daftar Gratis</Button>
      </div>
    </nav>
  )
}

export default function ServerErrorPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  return (
    <div className="min-h-screen flex flex-col">

      {token ? <AppNavbar /> : <LandingNavbar />}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center" style={{ background: '#fff' }}>
        <p className="text-xs font-black tracking-widest mb-4" style={{ color: '#9B87D9', textTransform: 'uppercase', letterSpacing: '4px' }}>
          Error 500
        </p>
        <h1 className="font-black mb-2" style={{ color: '#3D2F6B', fontSize: '56px', letterSpacing: '-2px', lineHeight: 1 }}>
          Server Sedang<br/>Bermasalah
        </h1>
        <p className="text-sm mb-10 max-w-sm" style={{ color: '#A89CC4' }}>
          Server kami sedang mengalami gangguan. Tim kami sudah diberitahu dan sedang memperbaikinya. Coba beberapa saat lagi.
        </p>
        <img src="/error-500.png" alt="500" style={{ width: 300, maxWidth: '100%', marginBottom: 48 }} />
        <button onClick={() => token ? navigate("/home") : navigate("/")} className="rp-btn-primary px-8 py-3 text-sm font-black">
          Kembali ke Beranda
        </button>
      </div>

      {/* Footer */}
      <footer id="contact" style={{ background: '#13132A' }}>
        <div className="max-w-6xl mx-auto px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#7C4DFF' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28"><ellipse cx="14" cy="17" rx="8" ry="6" fill="#F0F0F0"/><ellipse cx="14" cy="15" rx="7" ry="5" fill="#fff"/><circle cx="11" cy="13" r="1.5" fill="#2D1B69"/><circle cx="17" cy="13" r="1.5" fill="#2D1B69"/></svg>
                </div>
                <span className="font-black text-white text-lg">Rentopia</span>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Platform rental peer-to-peer terpercaya di Indonesia. Sewa apa saja, dari siapa saja.
              </p>
              <div className="flex gap-3">
                {[
                  { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', href: 'https://instagram.com' },
                  { name: 'TikTok', icon: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z', href: 'https://tiktok.com' },
                  { name: 'Twitter/X', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z', href: 'https://x.com' },
                ].map(s => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#7C4DFF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)"><path d={s.icon} /></svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-black text-sm text-white mb-4">Produk</p>
              <ul className="space-y-2">
                {['Cara Menyewa','Cara Menyewakan','Kategori Produk','Produk Terpopuler','Produk Terbaru'].map(item => (
                  <li key={item}><a href="#" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-black text-sm text-white mb-4">Perusahaan</p>
              <ul className="space-y-2">
                {['Tentang Kami','Blog','Karir','Press Kit','Kebijakan Privasi','Syarat & Ketentuan'].map(item => (
                  <li key={item}><a href="#" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-black text-sm text-white mb-4">Bantuan</p>
              <ul className="space-y-3">
                <li><p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>📞 Telepon</p><p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>+62 800 1234 5678</p><p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Sen–Jum, 08.00–17.00 WIB</p></li>
                <li><p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>✉️ Email</p><p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>support@rentopia.id</p></li>
                <li><p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>💬 Live Chat</p><p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Tersedia 24/7 di aplikasi</p></li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="max-w-6xl mx-auto px-12 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>© 2026 Rentopia · Oleh kelompok 3 MWP kelas B</p>
            <div className="flex gap-4">
              {['Kebijakan Privasi','Syarat & Ketentuan','Cookie'].map(item => (
                <a key={item} href="#" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.2)' }}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}