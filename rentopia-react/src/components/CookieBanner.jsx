import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('rentopia_cookies')
    if (!accepted) {
      const t = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('rentopia_cookies', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-sm
                    bg-[#02214b] border border-[#00d4ff]/20 rounded-2xl p-4 z-[8000]">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">🍪</span>
        <div>
          <h4 className="text-white font-bold text-sm">Persetujuan Cookies</h4>
          <p className="text-gray-400 text-xs mt-1">Rentopia menggunakan cookies untuk kenyamanan menyewa.</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={accept} className="flex-1 bg-[#00d4ff] text-[#0d0232] font-bold text-xs py-2.5 rounded-xl hover:bg-cyan-300 transition-all">
          SETUJU
        </button>
        <button onClick={() => setVisible(false)} className="flex-1 bg-white/10 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-white/20 transition-all">
          NANTI
        </button>
      </div>
    </div>
  )
}