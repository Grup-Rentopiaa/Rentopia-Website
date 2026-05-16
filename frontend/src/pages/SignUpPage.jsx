import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AlertBanner from "../components/AlertBanner";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";

function validate(values) {
  const errs = {};
  if (!values.username.trim()) errs.username = "Username wajib diisi";
  if (!values.email.trim()) errs.email = "Email wajib diisi";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = "Format email tidak valid";
  if (!values.password) errs.password = "Password wajib diisi";
  else if (values.password.length < 6) errs.password = "Minimal 6 karakter";
  if (values.password !== values.confirmPassword) errs.confirmPassword = "Password tidak sama";
  return errs;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { loading, error, signup } = useAuth();
  const { values, errors, handleChange, setFieldError } = useForm({
    username: "", email: "", password: "", confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length) {
      Object.entries(errs).forEach(([k, v]) => setFieldError(k, v));
      return;
    }
    const result = await signup({ username: values.username, email: values.email, password: values.password });
    if (result) navigate("/verify-otp", { state: { email: values.email, from: "register" } });
  }

  return (
    <AuthLayout>
      <div className="bg-purple-600 px-8 py-6">
        <h1 className="text-white text-xl font-bold">Buat Akun Baru</h1>
        <p className="text-purple-200 text-sm mt-1">Daftar sekarang dan mulai sewa dengan mudah</p>
      </div>

      <div className="px-8 py-6 space-y-4">
        <AlertBanner type="error" message={error} />

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <InputField
            label="Username" name="username" placeholder="Masukkan username"
            value={values.username} onChange={handleChange}
            error={errors.username} icon={User} required autoComplete="username"
          />
          <InputField
            label="Email" name="email" type="email" placeholder="contoh@email.com"
            value={values.email} onChange={handleChange}
            error={errors.email} icon={Mail} required autoComplete="email"
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-slate-700">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
              <input
                id="password" name="password"
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 karakter"
                value={values.password} onChange={handleChange}
                autoComplete="new-password"
                className={`w-full rounded-xl border px-4 py-3 pl-9 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-4 ${errors.password ? "border-red-400 focus:ring-red-50" : "border-slate-300 focus:border-purple-500 focus:ring-purple-50"}`}
              />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><span>⚠</span> {errors.password}</p>}
          </div>

          <InputField
            label="Konfirmasi Password" name="confirmPassword" type="password"
            placeholder="Ulangi password" value={values.confirmPassword}
            onChange={handleChange} error={errors.confirmPassword}
            icon={Lock} required autoComplete="new-password"
          />

          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Mendaftarkan...</> : "Daftar Sekarang"}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <span className="flex-1 border-t border-slate-200" />
          <span className="text-xs text-slate-400 font-medium">atau</span>
          <span className="flex-1 border-t border-slate-200" />
        </div>

        <button
          onClick={() => window.location.href = "http://localhost:3000/api/auth/google"}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Daftar dengan Google
        </button>

        <p className="text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-700">Masuk sekarang</Link>
        </p>
      </div>
    </AuthLayout>
  );
}