import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Isi email dan password!");
      return;
    }

    try {
      await login(form);
      navigate("/chat");
    } catch (err) {
      setError(err.message || "Login gagal");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-container" onSubmit={handleSubmit}>
        <h2 className="auth-title">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="auth-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="auth-input"
        />

        <button id="loginBtn" type="submit" className="auth-button">
          Login
        </button>

        <p className="auth-link">
          <Link to="/register">Belum punya akun? Daftar</Link>
        </p>

        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
}