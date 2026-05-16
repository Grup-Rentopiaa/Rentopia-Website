
import { useState } from "react";
import { Search, Zap, CheckCircle2, TrendingUp } from "lucide-react";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-16 md:pt-24 lg:pt-32">
      <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-8">

          {/* Teks utama + search bar */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 mb-6">
              <Zap className="h-4 w-4 fill-purple-600 text-purple-600" />
              Platform Sewa #1 di Indonesia
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Sewa barang mulai dari{" "}
              <span className="text-purple-600 inline-block">Rp25.000/hari</span>{" "}
              tanpa ribet.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
              Dari kamera, alat camping, hingga laptop untuk kebutuhan harianmu.
              Kenapa harus beli jika bisa sewa dengan mudah dan aman di Rentopia?
            </p>

            {/* Search Bar */}
            <div
              className={`mt-10 flex w-full max-w-xl items-center rounded-2xl border bg-white p-2 shadow-sm transition-all duration-300 ${
                isSearchFocused
                  ? "border-purple-500 shadow-purple-100 ring-4 ring-purple-50"
                  : "border-slate-300 hover:border-purple-400"
              }`}
            >
              <Search
                className={`ml-3 h-6 w-6 transition-colors ${
                  isSearchFocused ? "text-purple-600" : "text-slate-400"
                }`}
              />
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
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Tanpa Deposit
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Barang Terverifikasi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Bisa Diantar
              </span>
            </div>
          </div>

          {/* Visual / Mockup */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-purple-100 to-purple-50 blur-2xl"></div>
            <div className="relative rounded-3xl bg-white p-2 shadow-2xl ring-1 ring-slate-100">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Aplikasi Sewa Barang"
                className="rounded-2xl object-cover h-[300px] w-full sm:h-[400px] lg:h-[450px]"
              />

              {/* Float Card */}
              <div
                className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-100 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Disewa Hari Ini
                    </p>
                    <p className="text-lg font-black text-slate-900">450+ Barang</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}