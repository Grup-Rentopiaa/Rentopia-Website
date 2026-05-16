
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-10 md:px-12">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            R
          </div>
          <span className="font-bold text-slate-900">Rentopia</span>
        </div>

        <p className="text-sm font-medium text-slate-500">
          © 2026 Rentopia. Hak Cipta Dilindungi.
        </p>

        <div className="flex gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-purple-600">Privasi</a>
          <a href="#" className="hover:text-purple-600">Syarat &amp; Ketentuan</a>
          <a href="#" className="hover:text-purple-600">Bantuan</a>
        </div>
      </div>
    </footer>
  );
}