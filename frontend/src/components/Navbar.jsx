
export default function Navbar() {
  return (
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
  );
}