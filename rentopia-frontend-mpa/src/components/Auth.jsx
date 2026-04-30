import { useState, useRef, useEffect } from 'react';
import apiFetch from '../api';

const modalStyles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 500,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '70px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '32px',
    width: '360px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#6AABDB',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#9ca3af',
    marginBottom: '20px',
  },
  tabRow: {
    display: 'flex',
    borderBottom: '2px solid #e9ecef',
    marginBottom: '20px',
  },
  tab: (active) => ({
    flex: 1,
    padding: '8px',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid #6AABDB' : '2px solid transparent',
    color: active ? '#6AABDB' : '#9ca3af',
    fontWeight: active ? '600' : '400',
    cursor: 'pointer',
    marginBottom: '-2px',
    fontSize: '14px',
  }),
  formGroup: { marginBottom: '14px' },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#4b5563',
    fontSize: '13px',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '11px',
    background: '#6AABDB',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  error: {
    background: '#fff5f5',
    border: '1px solid #fed7d7',
    color: '#e53e3e',
    padding: '9px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '14px',
  },
  closeBtn: {
    float: 'right',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#9ca3af',
    cursor: 'pointer',
    lineHeight: '1',
    marginTop: '-4px',
  },
};

export default function Auth({ onClose, onLogin, defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode);
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const path = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, address: form.address };

      const data = await apiFetch(path, { method: 'POST', body: JSON.stringify(body) });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={modalStyles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyles.card}>
        <button style={modalStyles.closeBtn} onClick={onClose}>&times;</button>
        <div style={modalStyles.logoText}>Rentopia</div>
        <div style={modalStyles.subtitle}>Platform Penyewaan Produk</div>

        <div style={modalStyles.tabRow}>
          <button style={modalStyles.tab(mode === 'login')} onClick={() => { setMode('login'); setError(''); }}>
            Masuk
          </button>
          <button style={modalStyles.tab(mode === 'register')} onClick={() => { setMode('register'); setError(''); }}>
            Daftar
          </button>
        </div>

        {error && <div style={modalStyles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label}>Nama Lengkap</label>
              <input style={modalStyles.input} name="name" value={form.name} onChange={handleChange} placeholder="Nama lengkap" required />
            </div>
          )}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Email</label>
            <input style={modalStyles.input} name="email" type="email" value={form.email} onChange={handleChange} placeholder="contoh@email.com" required />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Password</label>
            <input style={modalStyles.input} name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
          </div>
          {mode === 'register' && (
            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label}>Alamat (Opsional)</label>
              <input style={modalStyles.input} name="address" value={form.address} onChange={handleChange} placeholder="Contoh: Jakarta Selatan" />
            </div>
          )}
          <button style={modalStyles.button} type="submit" disabled={loading}>
            {loading ? 'Memproses...' : (mode === 'login' ? 'Masuk' : 'Daftar Sekarang')}
          </button>
        </form>
      </div>
    </div>
  );
}
