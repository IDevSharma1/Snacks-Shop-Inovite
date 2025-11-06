import React, { createContext, useContext, useMemo, useState } from "react";

const API = (import.meta?.env?.VITE_API_BASE) || "http://localhost:5000/api";
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (emailOrUsername, password) => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password })
      });
      if (!res.ok) throw new Error((await res.json()).message || "Login failed");
      const data = await res.json();
      setToken(data.token);
      setUser({ username: data.username, role: data.role });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ username: data.username, role: data.role }));
      return true;
    } catch (e) {
      setError(e.message || "Login failed");
      return false;
    } finally { setLoading(false); }
  };

  const register = async (username, email, password, adminKey="") => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, adminKey })
      });
      if (!res.ok) throw new Error((await res.json()).message || "Register failed");
      return await login(email, password);
    } catch (e) {
      setError(e.message || "Register failed");
      return false;
    } finally { setLoading(false); }
  };

  const logout = () => {
    setToken(""); setUser(null); setError("");
    localStorage.removeItem("token"); localStorage.removeItem("user");
  };

  const value = useMemo(() => ({ token, user, loading, error, login, register, logout, API }), [token, user, loading, error]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
