// src/pages/VerifyOtpPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import OtpInput from "../components/OtpInput";
import AlertBanner from "../components/AlertBanner";
import { useAuth } from "../hooks/useAuth";

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = "", from = "login" } = location.state || {};

  const { loading, error, success, setSuccess, setError, verifyOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.replace(/\D/g, "").length < 6) {
      setError("Masukkan 6 digit kode OTP");
      return;
    }
    const result = await verifyOtp(otp);
    if (result) {
      setSuccess("Verifikasi berhasil! Mengalihkan...");
      setTimeout(() => navigate("/"), 1500);
    }
  }

  function handleResend() {
    if (countdown > 0) return;
    setCountdown(RESEND_COOLDOWN);
    setSuccess("Kode OTP baru telah dikirim ke email kamu.");
    // In a real app, call resend API here
  }

  const maskedEmail = email
    ? email.replace(/(.{2}).+(@.+)/, "$1***$2")
    : "email kamu";

  return (
    <AuthLayout>
      {/* Header strip */}
      <div className="auth-header-strip">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Mail size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Verifikasi OTP</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              {from === "register" ? "Konfirmasi pendaftaran" : "Konfirmasi login"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="auth-body stagger">
        {/* Info */}
        <div className="text-center mb-6 animate-fadeInUp">
          <p className="text-slate-600 text-sm leading-relaxed">
            Kode verifikasi 6 digit telah dikirim ke{" "}
            <span className="font-semibold text-blue-600">{maskedEmail}</span>.
            Kode berlaku selama <span className="font-semibold">5 menit</span>.
          </p>
        </div>

        <AlertBanner type="error" message={error} />
        <AlertBanner type="success" message={success} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="animate-fadeInUp mb-6">
            <p className="text-center text-xs text-slate-400 mb-3 font-medium uppercase tracking-widest">
              Masukkan Kode OTP
            </p>
            <OtpInput value={otp} onChange={setOtp} />
          </div>

          <div className="animate-fadeInUp">
            <button
              type="submit"
              disabled={loading || otp.replace(/\D/g, "").length < 6}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Memverifikasi...
                </>
              ) : (
                "Verifikasi"
              )}
            </button>
          </div>
        </form>

        {/* Resend */}
        <div className="mt-5 text-center animate-fadeInUp">
          {countdown > 0 ? (
            <p className="text-sm text-slate-500">
              Kirim ulang kode dalam{" "}
              <span className="font-bold text-blue-600 tabular-nums">
                {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                {String(countdown % 60).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Kirim ulang kode OTP
            </button>
          )}
        </div>

        <div className="auth-divider animate-fadeInUp">
          <span className="auth-divider-line" />
        </div>

        <p className="text-center text-sm text-slate-500 animate-fadeInUp">
          Salah akun?{" "}
          <button
            type="button"
            onClick={() => navigate(from === "register" ? "/register" : "/login")}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Kembali
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}