import { useState } from "react";

const BASE_URL = "http://localhost:3000/api/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function signup({ username, email, password }) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registrasi gagal");
      return data;
    } catch (e) {
      setError(e.message); return null;
    } finally {
      setLoading(false);
    }
  }

  async function login({ email, password }) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");
      return data;
    } catch (e) {
      setError(e.message); return null;
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(otp) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BASE_URL}/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP tidak valid");
      return data;
    } catch (e) {
      setError(e.message); return null;
    } finally {
      setLoading(false);
    }
  }

  async function forgotPassword(email) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengirim OTP");
      return data;
    } catch (e) {
      setError(e.message); return null;
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtpForgot(otp) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BASE_URL}/verify-otp-forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP tidak valid");
      return data;
    } catch (e) {
      setError(e.message); return null;
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword({ resetToken, newPassword }) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset password gagal");
      return data;
    } catch (e) {
      setError(e.message); return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, success, setError, setSuccess, signup, login, verifyOtp, forgotPassword, verifyOtpForgot, resetPassword };
}