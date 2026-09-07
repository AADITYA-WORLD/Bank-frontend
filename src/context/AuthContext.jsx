import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // App load hote hi check karo - user already login hai kya (cookie se)
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await api.get("/api/auth/getme");
      setUser(res.data.user);
    } catch (error) {
      setUser(null); // token invalid/expired/nahi hai
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await api.post("/api/auth/login", { email, password });
    setUser(res.data.user);
    return res.data;
  }

  async function register(name, email, password) {
    const res = await api.post("/api/auth/register", { name, email, password });
    setUser(res.data.user);
    return res.data;
  }

  async function logout() {
    await api.post("/api/auth/logout");
    setUser(null);
  }

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}