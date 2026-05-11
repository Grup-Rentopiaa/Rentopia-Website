const BASE_URL = 'http://localhost:3000';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { 
    ...options, 
    headers,
    credentials: 'include'
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Terjadi kesalahan');
  }

  return data;
}

export default apiFetch;
