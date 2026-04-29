// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AlertBanner from "../components/AlertBanner";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";

function validate(values) {
  const errs = {};
  if (!values.email.trim()) errs.email = "Email wajib diisi";
  if (!values.password) errs.password = "Password wajib diisi";
  return errs;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { loading, error, login } = useAuth();
  const { values, errors, handleChange, setFieldError } = useForm({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length) {
      Object.entries(errs).forEach(([k, v]) => setFieldError(k, v));
      return;
    }
    const result = await login({ email: values.email, password: values.password });
    if (result) {
      navigate("/verify-otp", { state: { email: values.email, from: "login" } });
    }
  }

  return (
    <AuthLayout>
      {/* Header strip */}
      <div className="auth-header-strip">
        <h1 className="text-white text-xl font-bold">Selamat Datang Kembali!</h1>
        <p className="text-blue-200 text-sm mt-1">
          Masuk ke akun Rentopia kamu
        </p>
      </div>

      {/* Body */}
      <div className="auth-body stagger">
        <AlertBanner type="error" message={error} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="animate-fadeInUp">
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="contoh@email.com"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
              autoComplete="email"
            />
          </div>

          <div className="animate-fadeInUp">
            <div className="auth-field">
              <label htmlFor="password" className="auth-label">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" size={16} />
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={values.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={`auth-input pr-10${errors.password ? " error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="auth-error-msg">
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="animate-fadeInUp mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Masuk...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </div>
        </form>

        <div className="auth-divider animate-fadeInUp">
          <span className="auth-divider-line" />
          <span className="text-xs text-slate-400 font-medium">atau</span>
          <span className="auth-divider-line" />
        </div>

        <p className="text-center text-sm text-slate-500 animate-fadeInUp">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Daftar gratis
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}