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
    <div className="max-w-lg mx-auto px-4 py-8 pb-24 text-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
        <p className="text-gray-400">Halaman Profil Sedang Dalam Pengembangan</p>
      </div>
    </div>
  );
}
