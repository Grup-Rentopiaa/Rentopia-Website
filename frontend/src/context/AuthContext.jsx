import { createContext, useEffect, useState } from "react";
import {
  getMeService,
  loginService,
  logoutService,
  registerService,
} from "../services/authService";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
    try {
      const currentUser = await getMeService();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(values) {
    const data = await loginService(values);
    setUser(data.user);
    return data.user;
  }

  async function register(values) {
    const data = await registerService(values);
    return data;
  }

  async function logout() {
    await logoutService();
    setUser(null);
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };