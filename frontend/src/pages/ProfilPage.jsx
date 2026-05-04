import {
  User, Package, Heart, MessageCircle,
  Settings, HelpCircle, LogOut, ChevronRight, Star,
} from 'lucide-react';

const MENU_GROUPS = [
  {
    title: 'Aktivitas Saya',
    items: [
      { Icon: Package,       label: 'Produk Saya',        desc: 'Kelola produk yang kamu sewakan' },
      { Icon: Star,          label: 'Ulasan',             desc: 'Rating & ulasan dari penyewa' },
      { Icon: Heart,         label: 'Wishlist',           desc: 'Produk yang kamu simpan' },
      { Icon: MessageCircle, label: 'Pesan',              desc: 'Riwayat chat dengan penyewa' },
    ],
  },
  {
    title: 'Akun',
    items: [
      { Icon: Settings,  label: 'Pengaturan',   desc: 'Notifikasi, privasi, keamanan' },
      { Icon: HelpCircle, label: 'Bantuan',     desc: 'Pusat bantuan & FAQ' },
      { Icon: LogOut,    label: 'Keluar',       desc: '', danger: true },
    ],
  },
];

export default function ProfilPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 pb-24">

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 flex items-center gap-4"
           style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <User size={32} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-base">Pengguna Rentopia</p>
          <p className="text-sm text-gray-400 truncate">pengguna@email.com</p>
          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
            Member
          </span>
        </div>
        <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Produk', value: '0' },
          { label: 'Disewa', value: '0' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center"
               style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <p className="text-xl font-bold text-blue-600">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Menu groups */}
      {MENU_GROUPS.map(({ title, items }) => (
        <div key={title} className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4"
             style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <p className="px-5 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {title}
          </p>
          <div className="divide-y divide-gray-100">
            {items.map(({ Icon, label, desc, danger }) => (
              <button key={label}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                  ${danger ? 'bg-red-50' : 'bg-blue-50'}`}>
                  <Icon size={18} className={danger ? 'text-red-500' : 'text-blue-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-gray-800'}`}>
                    {label}
                  </p>
                  {desc && <p className="text-xs text-gray-400 truncate">{desc}</p>}
                </div>
                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
