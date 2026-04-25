import { useEffect, useState } from "react";

const TRACKING_SERVER = "http://127.0.0.1:3001/track-visitor";

export default function LandingPage() {
  const [showCookie, setShowCookie] = useState(false);

  const products = [
    {
      icon: "📷",
      name: "Kamera DSLR",
      price: "Rp 75.000 / hari",
      desc: "Cocok untuk dokumentasi acara, foto produk, dan konten kreatif.",
    },
    {
      icon: "🏕️",
      name: "Tenda Camping",
      price: "Rp 50.000 / hari",
      desc: "Tenda kapasitas 4 orang untuk kegiatan outdoor dan camping.",
    },
    {
      icon: "🎤",
      name: "Sound System",
      price: "Rp 150.000 / hari",
      desc: "Peralatan audio untuk acara kecil, presentasi, dan gathering.",
    },
    {
      icon: "💻",
      name: "Laptop",
      price: "Rp 100.000 / hari",
      desc: "Laptop untuk kebutuhan kerja, belajar, presentasi, dan event.",
    },
    {
      icon: "🚲",
      name: "Sepeda",
      price: "Rp 35.000 / hari",
      desc: "Sepeda santai untuk olahraga, wisata, dan kebutuhan harian.",
    },
    {
      icon: "🧳",
      name: "Koper Travel",
      price: "Rp 25.000 / hari",
      desc: "Koper berbagai ukuran untuk perjalanan singkat maupun panjang.",
    },
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
      page: "Landing Page Sewa Online",
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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-xl font-bold text-white shadow">
              SO
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">SewaOnline</h1>
              <p className="text-xs text-slate-500">
                Platform sewa barang harian
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#produk" className="hover:text-[#1e3c72]">
              Produk
            </a>
            <a href="#fitur" className="hover:text-[#1e3c72]">
              Fitur
            </a>
            <a href="#tentang" className="hover:text-[#1e3c72]">
              Tentang
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-full border border-[#2196f3] px-5 py-2 text-sm font-semibold text-[#2196f3] hover:bg-blue-50"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-full bg-[#2196f3] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#0b7dda]"
            >
              Register
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-[#1e3c72]">
            Sewa Barang Lebih Mudah
          </span>

          <h2 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Sewa kebutuhan harian tanpa harus membeli.
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            SewaOnline membantu pengguna menemukan barang sewaan seperti kamera,
            tenda, laptop, sound system, koper, dan perlengkapan lainnya dengan
            mudah, cepat, dan praktis.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#produk"
              className="rounded-full bg-gradient-to-r from-[#1e3c72] to-[#2a5298] px-7 py-3 font-semibold text-white shadow-lg hover:shadow-xl"
            >
              Lihat Produk
            </a>

            <a
              href="#tentang"
              className="rounded-full border border-[#2196f3] bg-white px-7 py-3 font-semibold text-[#2196f3] hover:bg-blue-50"
            >
              Tentang Kami
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-2xl">
          <div className="rounded-[1.5rem] bg-gradient-to-r from-[#1e3c72] to-[#2a5298] p-6 text-white">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Produk unggulan</p>
                <h3 className="text-2xl font-bold">Kamera DSLR</h3>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
                Tersedia
              </span>
            </div>

            <div className="rounded-3xl bg-white p-5 text-slate-800">
              <div className="flex gap-5">
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-blue-100 text-6xl">
                  📷
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-bold">Kamera DSLR</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Sewa kamera untuk acara, foto produk, dan dokumentasi.
                    </p>
                  </div>

                  <div>
                    <p className="text-lg font-bold text-[#1e3c72]">
                      Rp 75.000 / hari
                    </p>
                    <button className="mt-3 rounded-full bg-[#2196f3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0b7dda]">
                      Sewa Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/15 p-3">
                <h4 className="font-bold">50+</h4>
                <p className="text-xs text-white/70">Produk</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-3">
                <h4 className="font-bold">24 Jam</h4>
                <p className="text-xs text-white/70">Akses</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-3">
                <h4 className="font-bold">Mudah</h4>
                <p className="text-xs text-white/70">Sewa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="bg-white px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-center text-3xl font-extrabold">
            Kenapa SewaOnline?
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-7 shadow-sm">
              <h4 className="text-xl font-bold text-[#1e3c72]">Hemat Biaya</h4>
              <p className="mt-3 text-sm text-slate-600">
                Pengguna dapat menyewa barang sesuai kebutuhan tanpa harus
                membeli.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-7 shadow-sm">
              <h4 className="text-xl font-bold text-[#1e3c72]">Banyak Pilihan</h4>
              <p className="mt-3 text-sm text-slate-600">
                Tersedia berbagai kategori barang seperti kamera, alat outdoor,
                dan elektronik.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-7 shadow-sm">
              <h4 className="text-xl font-bold text-[#1e3c72]">
                Mudah Digunakan
              </h4>
              <p className="mt-3 text-sm text-slate-600">
                Tampilan sederhana sehingga pengguna dapat menemukan produk
                dengan cepat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="produk" className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h3 className="text-3xl font-extrabold text-slate-900">
                Produk Sewa Tersedia
              </h3>
              <p className="mt-2 text-slate-500">
                Pilih barang yang ingin kamu sewa sesuai kebutuhan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.name}
                className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-36 items-center justify-center rounded-2xl bg-blue-50 text-6xl">
                  {product.icon}
                </div>

                <h4 className="mt-5 text-xl font-bold text-slate-900">
                  {product.name}
                </h4>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {product.desc}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="font-bold text-[#1e3c72]">
                    {product.price}
                  </span>

                  <button className="rounded-full bg-[#2196f3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b7dda]">
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tentang" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-r from-[#1e3c72] to-[#2a5298] p-10 text-center text-white shadow-2xl">
          <h3 className="text-3xl font-extrabold">Tentang SewaOnline</h3>
          <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-white/85">
            SewaOnline adalah rancangan landing page untuk platform penyewaan
            barang berbasis web. Website ini menampilkan informasi layanan,
            fitur utama, dan daftar produk sewa yang tersedia.
          </p>
        </div>
      </section>

      <footer className="border-t bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p>© 2026 SewaOnline. Landing Page Penyewaan Barang.</p>

          <div className="flex gap-5">
            <a href="#produk" className="hover:text-[#1e3c72]">
              Produk
            </a>
            <a href="#fitur" className="hover:text-[#1e3c72]">
              Fitur
            </a>
            <a href="#tentang" className="hover:text-[#1e3c72]">
              Tentang
            </a>
          </div>
        </div>
      </footer>

      {showCookie && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 px-4">
          <div className="relative w-full max-w-2xl rounded-[24px] bg-white p-8 shadow-2xl">
            <button
              onClick={closeCookie}
              className="absolute right-6 top-5 text-4xl font-light text-slate-800 hover:text-slate-500"
            >
              ×
            </button>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Cookies Settings
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-700">
              Kami menggunakan cookies untuk menyimpan informasi kunjungan,
              meningkatkan pengalaman pengguna, dan melakukan tracking
              pengunjung pada halaman ini.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                onClick={acceptCookie}
                className="rounded-xl bg-slate-950 px-6 py-4 text-xl font-bold text-white hover:bg-slate-800"
              >
                Accept
              </button>

              <button
                onClick={closeCookie}
                className="rounded-xl bg-slate-100 px-6 py-4 text-xl font-bold text-slate-900 hover:bg-slate-200"
              >
                Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}