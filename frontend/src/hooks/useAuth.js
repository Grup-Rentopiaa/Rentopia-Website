import { useState } from 'react';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function login({ email, password }) {
    setLoading(true); setError('');
    try {
      const res = await fetch('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login gagal');
      return data;
    } catch (e) { setError(e.message); return null;
    } finally { setLoading(false); }
  }

  async function signup({ username, email, password }) {
    setLoading(true); setError('');
    try {
      const res = await fetch('/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registrasi gagal');
      return data;
    } catch (e) { setError(e.message); return null;
    } finally { setLoading(false); }
  }

  async function verifyOtp(otp) {
    setLoading(true); setError('');
    try {
      const res = await fetch('/auth/otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ otp }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP tidak valid');
      return data;
    } catch (e) { setError(e.message); return null;
    } finally { setLoading(false); }
  }

  return { loading, error, success, setError, setSuccess, login, signup, verifyOtp };
}
