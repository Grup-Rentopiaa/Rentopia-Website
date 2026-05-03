
export default function Cookies({ onAccept, onClose }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] flex justify-center p-4 sm:p-6 pointer-events-none">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-[0_0_40px_rgba(0,0,0,0.15)] ring-1 ring-slate-200 pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6 translate-y-0 animate-[popup_0.5s_ease-out]">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">Pemberitahuan Cookie 🍪</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Kami menggunakan cookie untuk memastikan Anda mendapatkan pengalaman terbaik di
            situs kami. Termasuk untuk keperluan analitik dan tracking agar kami bisa
            menyesuaikan layanan Rentopia untukmu.
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 md:w-auto md:flex-row">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 md:w-auto"
          >
            Tolak
          </button>
          <button
            onClick={onAccept}
            className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 md:w-auto"
          >
            Mengerti &amp; Setuju
          </button>
        </div>
      </div>
    </div>
  );
}