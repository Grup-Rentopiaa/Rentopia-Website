import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Camera, Tent, Monitor, Shirt, Wrench, Gamepad2, Shield, Star, Users, TrendingUp, CheckCircle } from "lucide-react";

const FEATURES = [
  { icon: Tent,     title: "Alat Camping",     desc: "Tenda, kompor, sleeping bag" },
  { icon: Camera,   title: "Kamera & Foto",    desc: "DSLR, mirrorless, lensa" },
  { icon: Monitor,  title: "Elektronik",        desc: "Laptop, proyektor, speaker" },
  { icon: Shirt,    title: "Fashion & Kostum", desc: "Baju pesta, kostum, aksesoris" },
  { icon: Wrench,   title: "Peralatan",         desc: "Perkakas, mesin jahit, dll" },
  { icon: Gamepad2, title: "Gaming",            desc: "Console, VR, aksesori game" },
];

const STATS = [
  { value: "15.000+", label: "Produk Tersedia" },
  { value: "8.000+",  label: "Pengguna Aktif" },
  { value: "4.9",     label: "Rating Rata-rata" },
  { value: "50+ Kota", label: "Jangkauan Kami" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Daftar & Cari",   desc: "Buat akun gratis, lalu cari barang yang kamu butuhkan.",    color: "#E8DCFF" },
  { step: "2", title: "Chat & Booking",  desc: "Hubungi pemilik, sepakati harga, dan konfirmasi sewa.",     color: "#FFD6EC" },
  { step: "3", title: "Ambil & Nikmati", desc: "Ambil atau terima barang dan nikmati pengalaman menyewa!",  color: "#C9EFDC" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF", fontFamily: "Nunito, sans-serif" }}>
      {/* ── Navbar ── */}
      <nav className="rp-navbar">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg" style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)" }}>
              R
            </div>
            <span className="text-xl font-black" style={{ color: "#9B87D9" }}>Rentopia</span>
          </div>
          <div className="flex items-center gap-3">
            <button id="nav-login" onClick={() => navigate("/login")} className="rp-btn-outline text-sm px-5 py-2">Masuk</button>
            <button id="nav-register" onClick={() => navigate("/register")} className="rp-btn-primary text-sm px-5 py-2">Daftar Gratis</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6" style={{ background: "#E8DCFF", color: "#9B87D9" }}>
              <Sparkles size={14} /> Platform Sewa Barang #1 Indonesia
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4" style={{ color: "#3D2F6B" }}>
              Sewa Apa Saja,{" "}
              <span style={{ background: "linear-gradient(135deg, #C9B8FF, #FFB3D9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Kapan Saja
              </span>
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "#7B6AAA" }}>
              Dari kamera, laptop, alat camping, hingga fashion — sewa barang berkualitas dari sesama tanpa kerumitan. Mulai dari Rp25.000/hari.
            </p>
            <div className="flex flex-wrap gap-3">
              <button id="hero-cta-register" onClick={() => navigate("/register")} className="rp-btn-primary text-base px-8 py-4">
                Mulai Sewa Sekarang <ArrowRight size={18} />
              </button>
              <button id="hero-cta-login" onClick={() => navigate("/login")} className="rp-btn-outline text-base px-8 py-4">
                Sudah Punya Akun?
              </button>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 text-sm font-semibold" style={{ color: "#A89CC4" }}>
              <span className="flex items-center gap-1"><CheckCircle size={14} style={{ color: "#9B87D9" }} /> Tanpa Deposit</span>
              <span className="flex items-center gap-1"><CheckCircle size={14} style={{ color: "#9B87D9" }} /> Barang Terverifikasi</span>
              <span className="flex items-center gap-1"><CheckCircle size={14} style={{ color: "#9B87D9" }} /> Bisa Diantar</span>
            </div>
          </div>

          {/* Visual cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {["Kamera DSLR", "Tenda Camping", "Laptop Gaming", "Console PS5"].map((item, i) => (
              <div key={i} className="rp-card p-5 flex flex-col items-center text-center gap-2 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate("/register")}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: ["#E8DCFF","#FFD6EC","#D6F0FF","#C9EFDC"][i] }}>
                  {[<Camera key="c" size={22} style={{color:"#9B87D9"}}/>, <Tent key="t" size={22} style={{color:"#FF8FC5"}}/>, <Monitor key="m" size={22} style={{color:"#2660A4"}}/>, <Gamepad2 key="g" size={22} style={{color:"#2D7A55"}}/>][i]}
                </div>
                <p className="font-bold text-sm" style={{ color: "#7B6AAA" }}>{item}</p>
                <p className="text-xs font-semibold rp-badge rp-badge-primary">ab Rp{25 + i * 15}.000/hari</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <div key={i} className="rp-card p-6 text-center">
              <p className="text-2xl font-black" style={{ color: "#9B87D9" }}>{s.value}</p>
              <p className="text-sm font-semibold mt-1" style={{ color: "#A89CC4" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-black text-center mb-2" style={{ color: "#3D2F6B" }}>Sewa Dari Berbagai Kategori</h2>
        <p className="text-center mb-8" style={{ color: "#A89CC4" }}>Temukan barang yang kamu butuhkan dari ribuan pilihan</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} onClick={() => navigate("/register")} className="rp-card p-6 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ["#E8DCFF","#FFD6EC","#D6F0FF","#C9EFDC","#E8DCFF","#D6F0FF"][i] }}>
                <f.icon size={20} style={{ color: ["#9B87D9","#FF8FC5","#2660A4","#2D7A55","#9B87D9","#2660A4"][i] }} />
              </div>
              <div>
                <p className="font-bold" style={{ color: "#3D2F6B" }}>{f.title}</p>
                <p className="text-sm" style={{ color: "#A89CC4" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-3xl p-10" style={{ background: "linear-gradient(135deg, #E8DCFF, #FFD6EC)" }}>
          <h2 className="text-2xl font-black text-center mb-2" style={{ color: "#3D2F6B" }}>Cara Kerjanya Mudah</h2>
          <p className="text-center mb-8" style={{ color: "#7B6AAA" }}>Cukup 3 langkah untuk mulai menyewa</p>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={i} className="rp-card p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl mb-3" style={{ background: s.color, color: "#3D2F6B" }}>
                  {s.step}
                </div>
                <h3 className="font-black text-lg mb-1" style={{ color: "#3D2F6B" }}>{s.title}</h3>
                <p className="text-sm" style={{ color: "#7B6AAA" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-black text-center mb-8" style={{ color: "#3D2F6B" }}>Dipercaya Pengguna Kami</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "Dinda R.", city: "Jakarta",   text: "Kamera DSLR tersedia dan kondisi bagus! Prosesnya super mudah.", rating: 5 },
            { name: "Aldi S.",  city: "Bandung",   text: "Sewa tenda untuk camping, harga terjangkau dan pemilik ramah.", rating: 5 },
            { name: "Maya P.", city: "Surabaya",  text: "Laptop yang disewa persis seperti di foto. Recommended!", rating: 5 },
          ].map((t, i) => (
            <div key={i} className="rp-card p-5">
              <div className="flex gap-0.5 mb-3">
                {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={14} fill="#FFB3D9" color="#FFB3D9" />)}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#7B6AAA" }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm" style={{ background: ["#E8DCFF","#FFD6EC","#D6F0FF"][i], color: "#3D2F6B" }}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#3D2F6B" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "#A89CC4" }}>{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="rp-card p-10 text-center" style={{ background: "linear-gradient(135deg, #E8DCFF 0%, #FAF8FF 50%, #FFD6EC 100%)" }}>
          <h2 className="text-3xl font-black mb-3" style={{ color: "#3D2F6B" }}>Siap Mulai Menyewa?</h2>
          <p className="mb-6" style={{ color: "#7B6AAA" }}>Bergabung dengan ribuan pengguna Rentopia dan hemat lebih banyak!</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button id="cta-register" onClick={() => navigate("/register")} className="rp-btn-primary text-base px-10 py-4">
              Daftar Sekarang — Gratis!
            </button>
            <button id="cta-login" onClick={() => navigate("/login")} className="rp-btn-outline text-base px-10 py-4">
              Sudah Punya Akun
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-8 text-center" style={{ borderColor: "#E8DCFF", color: "#A89CC4" }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)" }}>R</div>
          <span className="font-black text-lg" style={{ color: "#9B87D9" }}>Rentopia</span>
        </div>
        <p className="text-sm">© 2025 Rentopia. Dibuat dengan penuh cinta untuk Indonesia.</p>
      </footer>
    </div>
  );
}