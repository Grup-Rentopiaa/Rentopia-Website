import { useState } from "react";


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  async function request(endpoint, body) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Terjadi kesalahan");
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  const signup          = (body) => request("/signup", body);
  const login           = (body) => request("/login", body);
  const verifyOtp       = (otp)  => request("/otp", { otp });
  const forgotPassword  = (email) => request("/forgot-password", { email });
  const verifyOtpForgot = (otp)  => request("/verify-otp-forgot", { otp });
  const resetPassword   = (body) => request("/reset-password", body);

  return {
    loading, error, success,
    setError, setSuccess,
    signup, login, verifyOtp,
    forgotPassword, verifyOtpForgot, resetPassword,
  };
}
