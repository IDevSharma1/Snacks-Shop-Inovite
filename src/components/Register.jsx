import React, { useState } from "react";
import { useAuth } from "../AuthContext";

export default function Register({ open, onClose }) {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({ username:"", email:"", password:"", adminKey:"" });
  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    const ok = await register(form.username.trim(), form.email.trim(), form.password, form.adminKey.trim());
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Create account</h3>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Username" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})}/>
          <input className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})}/>
          <input type="password" className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})}/>
          <input className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Admin Key (optional)" value={form.adminKey} onChange={(e)=>setForm({...form, adminKey:e.target.value})}/>
          {error && <div className="text-rose-300 text-sm">{error}</div>}
          <button className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-semibold" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
