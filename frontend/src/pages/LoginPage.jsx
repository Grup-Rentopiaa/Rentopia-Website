import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loading, error, login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const errs = {};
    if (!email.trim())    errs.email    = "Email wajib diisi";
    if (!password)        errs.password = "Password wajib diisi";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    const result = await login({ email, password });
    if (result) {
      localStorage.clear(); // tambah ini
      localStorage.setItem("token", result.token);
      localStorage.setItem("user",  JSON.stringify(result.user));
      navigate("/home", { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 rp-page" style={{ background: "#FAF8FF" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black" style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)" }}>
              R
            </div>
            <span className="text-2xl font-black" style={{ color: "#9B87D9" }}>Rentopia</span>
          </div>
          <h1 className="text-2xl font-black" style={{ color: "#3D2F6B" }}>Selamat Datang Kembali! 👋</h1>
          <p className="mt-1 text-sm" style={{ color: "#A89CC4" }}>Masuk ke akunmu dan mulai menyewa</p>
        </div>

        <div className="rp-card p-8">
          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: "#FFD6EC", color: "#9B4070" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: "#7B6AAA" }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#C9B8FF" }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  autoComplete="email"
                  className={`rp-input pl-10 ${fieldErrors.email ? "error" : ""}`}
                />
              </div>
              {fieldErrors.email && <p className="text-xs mt-1 font-semibold" style={{ color: "#FFB3D9" }}>{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold" style={{ color: "#7B6AAA" }}>Password</label>
                <Link to="/forgot-password" className="text-xs font-bold" style={{ color: "#C9B8FF" }}>Lupa password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#C9B8FF" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  className={`rp-input pl-10 pr-10 ${fieldErrors.password ? "error" : ""}`}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#C9B8FF" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs mt-1 font-semibold" style={{ color: "#FFB3D9" }}>{fieldErrors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="rp-btn-primary w-full py-3.5 text-base mt-2">
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Masuk...</>
              ) : "Masuk 🚀"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#A89CC4" }}>
            Belum punya akun?{" "}
            <Link to="/register" className="font-bold" style={{ color: "#9B87D9" }}>Daftar gratis</Link>
          </p>
        </div>

        <button onClick={() => navigate("/")} className="rp-back-btn mx-auto flex mt-6">
          <ArrowLeft size={16} /> Kembali ke Landing Page
        </button>
      </div>
    </div>
  );
}