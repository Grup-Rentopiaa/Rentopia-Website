

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 rp-page"
      style={{ background: "#FAF8FF" }}>
      <div className="w-full max-w-sm rp-card overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center pt-6 pb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg"
            style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)" }}>
            R
          </div>
          <span className="text-xl font-black" style={{ color: "#9B87D9" }}>Rentopia</span>
        </div>
        {children}
      </div>
    </div>
  );
}
