import React, { useState } from "react";
import { useAuth } from "../AuthContext";

export default function Login({ open, onClose }) {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ id: "", password: "" });
  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(form.id.trim(), form.password);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Sign in</h3>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Email or Username" value={form.id} onChange={(e)=>setForm({...form, id: e.target.value})}/>
          <input type="password" className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})}/>
          {error && <div className="text-rose-300 text-sm">{error}</div>}
          <button className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 font-semibold" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
