import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import OtpInput from "../components/OtpInput";
import AlertBanner from "../components/AlertBanner";
import { useAuth } from "../hooks/useAuth";

const RESEND_COOLDOWN = 60;

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
    console.log('OTP result:', result); // add this
    if (result) {
      if (result.user) localStorage.setItem('user', JSON.stringify(result.user));
      setSuccess("Verifikasi berhasil! Mengalihkan...");
      setTimeout(() => navigate("/home"), 1500);
    }
  }

  const maskedEmail = email
    ? email.replace(/(.{2}).+(@.+)/, "$1***$2")
    : "email kamu";

  return (
    <AuthLayout>
      <div className="bg-blue-600 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <Mail size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Verifikasi OTP</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              {from === "register" ? "Konfirmasi pendaftaran" : "Konfirmasi login"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-4">
        <p className="text-center text-slate-600 text-sm leading-relaxed">
          Kode verifikasi 6 digit telah dikirim ke{" "}
          <span className="font-semibold text-blue-600">{maskedEmail}</span>.
          Kode berlaku selama <span className="font-semibold">5 menit</span>.
        </p>

        <AlertBanner type="error" message={error} />
        <AlertBanner type="success" message={success} />

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <p className="text-center text-xs text-slate-400 font-medium uppercase tracking-widest">
            Masukkan Kode OTP
          </p>
          <OtpInput value={otp} onChange={setOtp} />

          <button
            type="submit"
            disabled={loading || otp.replace(/\D/g, "").length < 6}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Memverifikasi...</> : "Verifikasi"}
          </button>
        </form>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-slate-500">
              Kirim ulang dalam{" "}
              <span className="font-bold text-blue-600 tabular-nums">
                {String(Math.floor(countdown / 60)).padStart(2, "0")}:{String(countdown % 60).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button type="button" onClick={() => setCountdown(RESEND_COOLDOWN)}
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Kirim ulang kode OTP
            </button>
          )}
        </div>

        <p className="text-center text-sm text-slate-500">
          Salah akun?{" "}
          <button type="button"
            onClick={() => navigate(from === "register" ? "/register" : "/login")}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Kembali
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}