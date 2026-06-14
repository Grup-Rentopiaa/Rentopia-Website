
export default function CTA() {
  return (
    <section className="bg-white px-6 pb-20 md:px-12">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl relative">
        {/* Dekoratif blur */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-600/30 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-600/30 blur-3xl"></div>

        <div className="relative p-10 text-center md:p-20">
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
            Siap Menyewa Kebutuhanmu?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Bergabung bersama jutaan pengguna lainnya dan nikmati kemudahan sewa barang
            mulai hari ini.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-full bg-purple-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-purple-500 hover:scale-105 active:scale-95">
              Masuk ke Aplikasi
            </button>
            <button className="rounded-full bg-white/10 border border-white/20 px-10 py-4 text-lg font-bold text-white transition-all hover:bg-white/20">
              Lihat Katalog Dulu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}