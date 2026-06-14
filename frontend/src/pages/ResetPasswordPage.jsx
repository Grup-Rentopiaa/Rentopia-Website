import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AlertBanner from "../components/AlertBanner";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";

function validate(values) {
  const errs = {};
  if (!values.newPassword) errs.newPassword = "Password baru wajib diisi";
  else if (values.newPassword.length < 6) errs.newPassword = "Minimal 6 karakter";
  if (values.newPassword !== values.confirmPassword) errs.confirmPassword = "Password tidak sama";
  return errs;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { loading, error, resetPassword } = useAuth();
  const { values, errors, handleChange, setFieldError } = useForm({ newPassword: "", confirmPassword: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length) {
      Object.entries(errs).forEach(([k, v]) => setFieldError(k, v));
      return;
    }
    const resetToken = sessionStorage.getItem("resetToken");
    if (!resetToken) {
      navigate("/forgot-password");
      return;
    }
    const result = await resetPassword({ resetToken, newPassword: values.newPassword });
    if (result) {
      sessionStorage.removeItem("resetToken");
      navigate("/login");
    }
  }

  return (
    <AuthLayout>
      <div className="bg-purple-600 px-8 py-6">
        <h1 className="text-white text-xl font-bold">Buat Password Baru</h1>
        <p className="text-purple-200 text-sm mt-1">Pastikan password baru kamu kuat dan mudah diingat</p>
      </div>

      <div className="px-8 py-6 space-y-4">
        <AlertBanner type="error" message={error} />

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <InputField
            label="Password Baru" name="newPassword" type="password"
            placeholder="Min. 6 karakter"
            value={values.newPassword} onChange={handleChange}
            error={errors.newPassword} icon={Lock} required autoComplete="new-password"
          />
          <InputField
            label="Konfirmasi Password Baru" name="confirmPassword" type="password"
            placeholder="Ulangi password baru"
            value={values.confirmPassword} onChange={handleChange}
            error={errors.confirmPassword} icon={Lock} required autoComplete="new-password"
          />

          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Menyimpan...</> : "Simpan Password Baru"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}