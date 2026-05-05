const BASE_URL = 'http://localhost:3000/api';

async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Terjadi kesalahan');
  }

  return data;
}

export default apiFetch;
