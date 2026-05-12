export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-slate-200">
        <div className="flex items-center gap-2 justify-center pt-6 pb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-base font-black text-white shadow-md">
            R
          </div>
          <span className="text-xl font-black tracking-tight text-blue-600">Rentopia</span>
        </div>
        {children}
      </div>
    </div>
  );
}