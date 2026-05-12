import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import OtpInput from "../components/OtpInput";
import AlertBanner from "../components/AlertBanner";
import { useAuth } from "../hooks/useAuth";

export default function VerifyOtpForgotPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = "" } = location.state || {};
  const { loading, error, setError, verifyOtpForgot } = useAuth();
  const [otp, setOtp] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.replace(/\D/g, "").length < 6) {
      setError("Masukkan 6 digit kode OTP");
      return;
    }
    const result = await verifyOtpForgot(otp);
    if (result) {
      sessionStorage.setItem("resetToken", result.resetToken);
      navigate("/reset-password");
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
            <p className="text-blue-200 text-sm mt-0.5">Reset password</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-4">
        <p className="text-center text-slate-600 text-sm leading-relaxed">
          Kode OTP telah dikirim ke{" "}
          <span className="font-semibold text-blue-600">{maskedEmail}</span>.
          Kode berlaku selama <span className="font-semibold">5 menit</span>.
        </p>

        <AlertBanner type="error" message={error} />

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
      </div>
    </AuthLayout>
  );
}