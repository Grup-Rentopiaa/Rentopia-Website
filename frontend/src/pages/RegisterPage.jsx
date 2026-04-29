import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function validate() {
    if (!form.name || !form.email || !form.password) {
      return "Semua field wajib diisi!";
    }

    if (!form.email.includes("@")) {
      return "Format email tidak valid";
    }

    if (form.password.length < 6) {
      return "Password minimal 6 karakter";
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        address: form.address || null,
        latitude: form.latitude || null,
        longitude: form.longitude || null,
      });

      
      navigate("/login");
    } catch (err) {
      setError(err.message || "Register gagal");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-container" onSubmit={handleSubmit}>
        <h2 className="auth-title">Daftar</h2>

        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={handleChange}
          className="auth-input-tight"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="auth-input-tight"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="auth-input-tight"
        />

        <input
          type="text"
          name="address"
          placeholder="Alamat"
          value={form.address}
          onChange={handleChange}
          className="auth-input-tight"
        />

        <input
          type="text"
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          onChange={handleChange}
          className="auth-input-tight"
        />

        <input
          type="text"
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          onChange={handleChange}
          className="auth-input-tight"
        />

        <button id="registerBtn" type="submit" className="auth-button">
          Daftar
        </button>

        <p className="auth-link">
          <Link to="/login">Sudah punya akun? Login</Link>
        </p>

        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
}