import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Mengubah default state agar langsung terisi data "dummy"
  // Ini membuat aplikasi menganggap user sudah login secara otomatis
  const [user, setUser] = useState({ name: 'Guest User', role: 'public' }); 
  const [token, setToken] = useState('dummy-token-akses-bebas');

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    // Agar benar-benar bebas akses, kita bisa buat logout tidak menghapus data
    // atau biarkan seperti ini jika ingin simulasi saja.
    setUser({ name: 'Guest User', role: 'public' });
    setToken('dummy-token-akses-bebas');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);