import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AlertBanner from "../components/AlertBanner";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { loading, error, forgotPassword } = useAuth();
  const { values, errors, handleChange, setFieldError } = useForm({ email: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!values.email.trim()) {
      setFieldError("email", "Email wajib diisi");
      return;
    }
    const result = await forgotPassword(values.email);
    if (result) navigate("/verify-otp-forgot", { state: { email: values.email } });
  }

  return (
    <AuthLayout>
      <div className="bg-blue-600 px-8 py-6">
        <h1 className="text-white text-xl font-bold">Lupa Password?</h1>
        <p className="text-blue-200 text-sm mt-1">Masukkan email untuk menerima kode OTP</p>
      </div>

      <div className="px-8 py-6 space-y-4">
        <AlertBanner type="error" message={error} />

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <InputField
            label="Email" name="email" type="email"
            placeholder="contoh@email.com"
            value={values.email} onChange={handleChange}
            error={errors.email} icon={Mail} required autoComplete="email"
          />
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Mengirim...</> : "Kirim Kode OTP"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Ingat password kamu?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">Masuk di sini</Link>
        </p>
      </div>
    </AuthLayout>
  );
}