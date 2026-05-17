import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function validate(values) {
  const errs = {};
  if (!values.username.trim())  errs.username = "Username wajib diisi";
  if (!values.email.trim())     errs.email    = "Email wajib diisi";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = "Format email tidak valid";
  if (!values.password)         errs.password = "Password wajib diisi";
  else if (values.password.length < 6) errs.password = "Minimal 6 karakter";
  if (values.password !== values.confirmPassword) errs.confirmPassword = "Password tidak sama";
  return errs;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const { loading, error, signup } = useAuth();
  const [values, setValues]   = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors]   = useState({});
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const result = await signup({ username: values.username, email: values.email, password: values.password });
    if (result) navigate("/verify-otp", { state: { email: values.email, from: "register" } });
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
          <h1 className="text-2xl font-black" style={{ color: "#3D2F6B" }}>Buat Akun Gratis ✨</h1>
          <p className="mt-1 text-sm" style={{ color: "#A89CC4" }}>Daftar dan mulai sewa barang impianmu</p>
        </div>

        <div className="rp-card p-8">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: "#FFD6EC", color: "#9B4070" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: "#7B6AAA" }}>Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#C9B8FF" }} />
                <input name="username" value={values.username} onChange={handleChange} placeholder="username_kamu" autoComplete="username"
                  className={`rp-input pl-10 ${errors.username ? "error" : ""}`} />
              </div>
              {errors.username && <p className="text-xs mt-1 font-semibold" style={{ color: "#FFB3D9" }}>{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: "#7B6AAA" }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#C9B8FF" }} />
                <input name="email" type="email" value={values.email} onChange={handleChange} placeholder="contoh@email.com" autoComplete="email"
                  className={`rp-input pl-10 ${errors.email ? "error" : ""}`} />
              </div>
              {errors.email && <p className="text-xs mt-1 font-semibold" style={{ color: "#FFB3D9" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: "#7B6AAA" }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#C9B8FF" }} />
                <input name="password" type={showPass ? "text" : "password"} value={values.password} onChange={handleChange}
                  placeholder="Min. 6 karakter" autoComplete="new-password"
                  className={`rp-input pl-10 pr-10 ${errors.password ? "error" : ""}`} />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#C9B8FF" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1 font-semibold" style={{ color: "#FFB3D9" }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: "#7B6AAA" }}>Konfirmasi Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#C9B8FF" }} />
                <input name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange}
                  placeholder="Ulangi password" autoComplete="new-password"
                  className={`rp-input pl-10 ${errors.confirmPassword ? "error" : ""}`} />
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1 font-semibold" style={{ color: "#FFB3D9" }}>{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="rp-btn-primary w-full py-3.5 text-base mt-2">
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Mendaftarkan...</>
              ) : "Daftar Sekarang 🎉"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#A89CC4" }}>
            Sudah punya akun?{" "}
            <Link to="/login" className="font-bold" style={{ color: "#9B87D9" }}>Masuk sekarang</Link>
          </p>
        </div>

        <button onClick={() => navigate("/")} className="rp-back-btn mx-auto flex mt-6">
          <ArrowLeft size={16} /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}