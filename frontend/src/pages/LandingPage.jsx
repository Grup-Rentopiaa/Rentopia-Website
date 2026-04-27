import { useEffect, useState } from "react";
import { 
  Search, 
  Star,
  Users,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  PackageSearch,
  CalendarDays,
  CreditCard,
  TrendingUp,
  Clock
} from "lucide-react";

const TRACKING_SERVER = "http://127.0.0.1:3001/track-visitor";

export default function LandingPage() {
  const [showCookie, setShowCookie] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const popularProducts = [
    {
      id: 1,
      name: "Kamera DSLR Canon EOS",
      price: "Rp 75.000",
      rating: 4.9,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Fotografi"
    },
    {
      id: 2,
      name: "Tenda Dome 4 Orang",
      price: "Rp 50.000",
      rating: 4.8,
      reviews: 94,
      image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Outdoor"
    },
    {
      id: 3,
      name: "MacBook Pro M2 2023",
      price: "Rp 150.000",
      rating: 5.0,
      reviews: 215,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Elektronik"
    },
    {
      id: 4,
      name: "Speaker Portable JBL",
      price: "Rp 45.000",
      rating: 4.7,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Audio"
    }
  ];

  function setCookie(name, value, days) {
    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toUTCString();

    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/`;
  }

  function getCookie(name) {
    const cookies = document.cookie.split("; ");

    const found = cookies.find((cookie) =>
      cookie.startsWith(`${name}=`)
    );

    return found ? decodeURIComponent(found.split("=")[1]) : null;
  }

  async function trackVisitor() {
    const consent = localStorage.getItem("cookieConsent");

    if (consent !== "accepted") {
      return;
    }

    let visitorId =
      localStorage.getItem("landingVisitorId") ||
      getCookie("landingVisitorId");

    if (!visitorId) {
      visitorId = `visitor-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;
    }

    localStorage.setItem("landingVisitorId", visitorId);
    setCookie("landingVisitorId", visitorId, 7);

    const visitorData = {
      visitorId,
      page: "Landing Page Rentopia",
      path: window.location.pathname,
      browser: navigator.userAgent,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      visitedAt: new Date().toISOString(),
      cookieConsent: getCookie("cookieConsent"),
    };

    localStorage.setItem("landingLastVisit", JSON.stringify(visitorData));
    sessionStorage.setItem("landingSessionVisit", JSON.stringify(visitorData));
    setCookie("landingLastVisit", JSON.stringify(visitorData), 7);

    try {
      await fetch(TRACKING_SERVER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(visitorData),
      });
    } catch (error) {
      console.error("Gagal mengirim tracking:", error);
    }
  }

  useEffect(() => {
    // --- DIRESET OTOMATIS UNTUK KEPERLUAN TESTING DESAIN ---
    localStorage.removeItem("cookieConsent");
    document.cookie = "cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // -------------------------------------------------------

    const consent =
      localStorage.getItem("cookieConsent") ||
      getCookie("cookieConsent");

    if (consent !== "accepted") {
      setShowCookie(true);
      return;
    }

    trackVisitor();
  }, []);

  function acceptCookie() {
    localStorage.setItem("cookieConsent", "accepted");
    setCookie("cookieConsent", "accepted", 7);
    setShowCookie(false);
    trackVisitor();
  }

  function closeCookie() {
    setShowCookie(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-md">
              R
            </div>
            <span className="text-2xl font-black tracking-tight text-blue-600">Rentopia</span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#cara-kerja" className="hover:text-blue-600 transition-colors">Cara Kerja</a>
            <a href="#produk" className="hover:text-blue-600 transition-colors">Produk</a>
            <a href="#keunggulan" className="hover:text-blue-600 transition-colors">Keunggulan</a>
          </div>

          <div className="flex items-center gap-2">
            <a href="/login" className="hidden px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:text-blue-600 sm:block">
              Masuk
            </a>
            <a href="/register" className="hidden px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:text-blue-600 sm:block">
              Daftar
            </a>
            <a href="#produk" className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 ml-2">
              Mulai Sewa
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white pb-20 pt-16 md:pt-24 lg:pt-32">
        <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-12">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-8">
            
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 mb-6">
                <Zap className="h-4 w-4 fill-blue-600 text-blue-600" />
                Platform Sewa #1 di Indonesia
              </div>
              
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Sewa barang mulai dari <span className="text-blue-600 inline-block">Rp25.000/hari</span> tanpa ribet.
              </h1>
              
              <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
                Dari kamera, alat camping, hingga laptop untuk kebutuhan harianmu. Kenapa harus beli jika bisa sewa dengan mudah dan aman di Rentopia?
              </p>

              {/* INTERACTIVE SEARCH BAR */}
              <div className={`mt-10 flex w-full max-w-xl items-center rounded-2xl border bg-white p-2 shadow-sm transition-all duration-300 ${isSearchFocused ? 'border-blue-500 shadow-blue-100 ring-4 ring-blue-50' : 'border-slate-300 hover:border-blue-400'}`}>
                <Search className={`ml-3 h-6 w-6 transition-colors ${isSearchFocused ? 'text-blue-600' : 'text-slate-400'}`} />
                <input 
                  type="text" 
                  className="w-full bg-transparent px-4 py-3 text-base text-slate-800 placeholder-slate-400 outline-none"
                  placeholder="Cari kamera, tenda, proyektor..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <button className="hidden sm:inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold tracking-wide text-white transition-all hover:bg-slate-800 focus:outline-none">
                  Cari Barang
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Tanpa Deposit</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Barang Terverifikasi</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Bisa Diantar</span>
              </div>
            </div>

            {/* HERO VISUAL (MOCKUP/ILLUSTRATION) */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-100 to-blue-50 blur-2xl"></div>
              <div className="relative rounded-3xl bg-white p-2 shadow-2xl ring-1 ring-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Aplikasi Sewa Barang" 
                  className="rounded-2xl object-cover h-[300px] w-full sm:h-[400px] lg:h-[450px]"
                />
                
                {/* Float Card */}
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-100 animate-bounce" style={{animationDuration: '3s'}}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disewa Hari Ini</p>
                      <p className="text-lg font-black text-slate-900">450+ Barang</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="border-y border-slate-200 bg-slate-50 py-10">
        <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 divide-x divide-slate-200">
            <div className="flex flex-col items-center justify-center text-center">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-3xl font-black text-slate-900">10.000+</p>
              <p className="text-sm font-medium text-slate-500">Pengguna Aktif</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <Star className="h-8 w-8 fill-yellow-400 text-yellow-400 mb-2" />
              <p className="text-3xl font-black text-slate-900">4.9/5</p>
              <p className="text-sm font-medium text-slate-500">Rating Platform</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-3xl font-black text-slate-900">100%</p>
              <p className="text-sm font-medium text-slate-500">Aman & Terjamin</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <Clock className="h-8 w-8 text-indigo-500 mb-2" />
              <p className="text-3xl font-black text-slate-900">24 Jam</p>
              <p className="text-sm font-medium text-slate-500">Support Tersedia</p>
            </div>
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cara-kerja" className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-screen-xl px-6 md:px-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Cara Kerja Rentopia</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Tiga langkah mudah untuk mulai meminjam barang impianmu tanpa proses yang membingungkan.</p>
          
          <div className="mt-16 grid gap-10 sm:grid-cols-3 relative">
            <div className="hidden sm:block absolute top-[20%] left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10 w-[68%]"></div>
            
            <div className="group flex flex-col items-center bg-white">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                <PackageSearch className="h-10 w-10" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900">1. Cari Barang</h3>
              <p className="mt-2 text-slate-600 text-sm px-4">Temukan barang yang kamu butuhkan dari ribuan koleksi katalog kami.</p>
            </div>
            
            <div className="group flex flex-col items-center bg-white">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                <CalendarDays className="h-10 w-10" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900">2. Pilih Tanggal</h3>
              <p className="mt-2 text-slate-600 text-sm px-4">Tentukan durasi peminjaman sesuai kebutuhan dan lihat total biaya transparan.</p>
            </div>
            
            <div className="group flex flex-col items-center bg-white">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                <CreditCard className="h-10 w-10" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900">3. Sewa & Bayar</h3>
              <p className="mt-2 text-slate-600 text-sm px-4">Lakukan pembayaran aman. Barang bisa DIAMBIL atau DIANTAR ke lokasimu!</p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section id="produk" className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-12">
          <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Sedang Tren Disewa</h2>
              <p className="mt-4 text-lg text-slate-600">Pilihan produk favorit pengguna minggu ini dengan harga terbaik.</p>
            </div>
            <a href="#" className="group inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap">
              Lihat semua <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-blue-500">
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-slate-800 shadow-sm">
                    {product.category}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-slate-800">{product.rating}</span>
                    <span>({product.reviews})</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{product.name}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Mulai dari</p>
                      <p className="text-lg font-black text-blue-600">{product.price}<span className="text-sm font-normal text-slate-500">/hari</span></p>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEUNGGULAN (PLATFORM ADVANTAGES) */}
      <section id="keunggulan" className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-16">Kenapa Harus Rentopia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-all hover:bg-white hover:shadow-xl hover:ring-1 hover:ring-blue-100">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sangat Hemat</h3>
              <p className="text-slate-600">Gunakan barang mahal dengan membayar sebagian kecil harganya. Tabung uangmu untuk hal yang lebih penting.</p>
            </div>
            
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-all hover:bg-white hover:shadow-xl hover:ring-1 hover:ring-blue-100">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-6">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Kualitas Terjamin</h3>
              <p className="text-slate-600">Semua vendor dan barang melalui seleksi ketat. Barang rusak? Uang kembali atau ganti unit langsung.</p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-all hover:bg-white hover:shadow-xl hover:ring-1 hover:ring-blue-100">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-6">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Koleksi Terlengkap</h3>
              <p className="text-slate-600">Dari lensa langka hingga PlayStation terbaru, apapun kebutuhan acaramu pasti dapat ditemukan di sini.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white px-6 pb-20 md:px-12">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl relative">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-600/30 blur-3xl"></div>
          
          <div className="relative p-10 text-center md:p-20">
            <h2 className="text-3xl font-extrabold text-white sm:text-5xl">Siap Menyewa Kebutuhanmu?</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Bergabung bersama jutaan pengguna lainnya dan nikmati kemudahan sewa barang mulai hari ini.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <button className="rounded-full bg-blue-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-blue-500 hover:scale-105 active:scale-95">
                Masuk ke Aplikasi
              </button>
              <button className="rounded-full bg-white/10 border border-white/20 px-10 py-4 text-lg font-bold text-white transition-all hover:bg-white/20">
                Lihat Katalog Dulu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-6 py-10 md:px-12">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">R</div>
            <span className="font-bold text-slate-900">Rentopia</span>
          </div>
          
          <p className="text-sm font-medium text-slate-500">© 2026 Rentopia. Hak Cipta Dilindungi.</p>

          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600">Privasi</a>
            <a href="#" className="hover:text-blue-600">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-blue-600">Bantuan</a>
          </div>
        </div>
      </footer>

      {/* COOKIES MODAL */}
      {showCookie && (
        <div className="fixed bottom-0 left-0 right-0 z-[999] flex justify-center p-4 sm:p-6 pointer-events-none">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-[0_0_40px_rgba(0,0,0,0.15)] ring-1 ring-slate-200 pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6 translate-y-0 animate-[popup_0.5s_ease-out]">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">Pemberitahuan Cookie 🍪</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Kami menggunakan cookie untuk memastikan Anda mendapatkan pengalaman terbaik di situs kami. Termasuk untuk keperluan analitik dan tracking agar kami bisa menyesuaikan layanan Rentopia untukmu.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 md:w-auto md:flex-row">
              <button
                onClick={closeCookie}
                className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 md:w-auto"
              >
                Tolak
              </button>
              <button
                onClick={acceptCookie}
                className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 md:w-auto"
              >
                Mengerti & Setuju
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}