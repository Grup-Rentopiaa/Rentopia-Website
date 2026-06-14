import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="mb-3">
              <span className="text-xl font-extrabold text-purple-600 tracking-tight">Rento</span>
              <span className="text-xl font-extrabold text-purple-800 tracking-tight">pia</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Platform penyewaan produk terpercaya di Indonesia. Sewa apa saja, kapan saja, dengan mudah dan aman.
            </p>
          </div>

          {/* Tentang */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Tentang Rentopia</h4>
            <ul className="space-y-2.5">
              {['Tentang Kami', 'Karir', 'Blog', 'Berita & Media', 'Rentopia Affiliate'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Bantuan & Panduan</h4>
            <ul className="space-y-2.5">
              {['Pusat Bantuan', 'Cara Menyewa', 'Cara Menyewakan', 'Syarat dan Ketentuan', 'Kebijakan Privasi'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Layanan</h4>
            <ul className="space-y-2.5">
              {['Rentopia Care', 'Jaminan Keamanan', 'Mitra Logistik', 'Asuransi Sewa', 'Program Loyalitas'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">
            &copy; 2024 - 2026, PT. Rentopia Indonesia. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-sm text-gray-400 hover:text-purple-600 transition-colors">Privasi</a>
            <a href="#" className="text-sm text-gray-400 hover:text-purple-600 transition-colors">Ketentuan</a>
            <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-600 transition-colors">
              <Globe size={14} /> Indonesia
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
