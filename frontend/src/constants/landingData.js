export const TRACKING_SERVER = import.meta.env.VITE_TRACKING_URL || "http://localhost:3000/api/tracking/track-visitor";

export const POPULAR_PRODUCTS = [
  {
    id: 1,
    name: "Kamera DSLR Canon EOS",
    price: "Rp 75.000",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Fotografi",
  },
  {
    id: 2,
    name: "Tenda Dome 4 Orang",
    price: "Rp 50.000",
    rating: 4.8,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Outdoor",
  },
  {
    id: 3,
    name: "MacBook Pro M2 2023",
    price: "Rp 150.000",
    rating: 5.0,
    reviews: 215,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Elektronik",
  },
  {
    id: 4,
    name: "Speaker Portable JBL",
    price: "Rp 45.000",
    rating: 4.7,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Audio",
  },
];

export const TRUST_STATS = [
  { id: 1, icon: "Users",       value: "10.000+", label: "Pengguna Aktif" },
  { id: 2, icon: "Star",        value: "4.9/5",   label: "Rating Platform" },
  { id: 3, icon: "ShieldCheck", value: "100%",    label: "Aman & Terjamin" },
  { id: 4, icon: "Clock",       value: "24 Jam",  label: "Support Tersedia" },
];

export const HOW_IT_WORKS_STEPS = [
  {
    id: 1,
    icon: "PackageSearch",
    title: "1. Cari Barang",
    description: "Temukan barang yang kamu butuhkan dari ribuan koleksi katalog kami.",
  },
  {
    id: 2,
    icon: "CalendarDays",
    title: "2. Pilih Tanggal",
    description: "Tentukan durasi peminjaman sesuai kebutuhan dan lihat total biaya transparan.",
  },
  {
    id: 3,
    icon: "CreditCard",
    title: "3. Sewa & Bayar",
    description: "Lakukan pembayaran aman. Barang bisa DIAMBIL atau DIANTAR ke lokasimu!",
  },
];

export const ADVANTAGES = [
  {
    id: 1,
    emoji: "💰",
    title: "Sangat Hemat",
    description: "Gunakan barang mahal dengan membayar sebagian kecil harganya. Tabung uangmu untuk hal yang lebih penting.",
  },
  {
    id: 2,
    emoji: "🛡️",
    title: "Kualitas Terjamin",
    description: "Semua vendor dan barang melalui seleksi ketat. Barang rusak? Uang kembali atau ganti unit langsung.",
  },
  {
    id: 3,
    emoji: "📦",
    title: "Koleksi Terlengkap",
    description: "Dari lensa langka hingga PlayStation terbaru, apapun kebutuhan acaramu pasti dapat ditemukan di sini.",
  },
];