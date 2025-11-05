import React, { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "../AuthContext";

export default function Header({
  categories = [],
  overflowCategories = [],
  selectedCat,
  onChangeCategory,
  showDropdown,
  setShowDropdown,
  onOpenSearch = () => {},
  onOpenCart = () => {},
}) {
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const mobileSheetRef = useRef(null);

  const { count } = useCart();
  const { user, logout } = useAuth();

  // Unified auth modal
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);

  // Mobile categories sheet
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setShowDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);

      // If click happens inside mobile sheet, ignore
      if (mobileSheetRef.current && mobileSheetRef.current.contains(e.target)) return;
      // If the sheet is open and click is outside, close it
      if (mobileMenuOpen && !mobileSheetRef.current?.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [setShowDropdown, mobileMenuOpen]);

  const basePill =
    "px-3 py-1.5 rounded-full text-sm font-medium transition-all border backdrop-blur-xl";
  const activePill = "bg-white/25 text-white border-white/40 shadow-lg";
  const idlePill =
    "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border-white/20";

  return (
    <header className="w-full sticky top-1 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative grid grid-cols-3 items-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.18)] px-3 sm:px-6 py-2 sm:py-3">
          {/* Brand */}
          <div className="text-white font-black tracking-tight text-lg sm:text-2xl">
            SnackShop
          </div>

          {/* Desktop Nav (hidden on mobile) */}
          <nav className="hidden md:flex items-center justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                className={`${basePill} ${
                  selectedCat === c.id ? activePill : idlePill
                }`}
                onClick={() => onChangeCategory(c.id)}
              >
                {c.name}
              </button>
            ))}
            {overflowCategories.length > 0 && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowDropdown((v) => !v)}
                  className={`${basePill} ${idlePill} flex items-center gap-2`}
                >
                  More{" "}
                  <span className="text-xs opacity-80">
                    {overflowCategories.length}
                  </span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl p-2">
                    <ul className="max-h-[60vh] overflow-y-auto pr-1">
                      {overflowCategories.map((c) => (
                        <li key={c.id} className="p-1">
                          <button
                            className="w-full text-left px-3 py-2 rounded-xl text-sm text-white/90 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-all"
                            onClick={() => onChangeCategory(c.id)}
                          >
                            {c.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile hamburger (center column) */}
          <div className="md:hidden flex items-center justify-center">
            <button
              aria-label="Menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="h-9 w-9 flex items-center justify-center rounded-full border-2 border-white/25 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-xl transition-all"
            >
              ☰
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <button
              aria-label="Search"
              className="h-9 w-9 flex items-center justify-center rounded-full border-2 border-white/25 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-xl transition-all"
              onClick={onOpenSearch}
            >
              🔎
            </button>

            <button
              aria-label="Cart"
              className="h-9 w-9 flex items-center justify-center rounded-full border-2 border-white/25 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-xl transition-all relative"
              onClick={onOpenCart}
            >
              🛒
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/90 text-black font-semibold">
                  {count}
                </span>
              )}
            </button>

            {/* Auth/Profile Section */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="h-9 w-9 grid place-items-center rounded-full bg-green-400 text-white font-semibold transition-all hover:scale-105"
                  title={user.username}
                >
                  {user.username?.[0]?.toUpperCase() || "U"}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl p-2">
                    <button
                      onClick={() => {
                        window.location.href = "/admin";
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm text-white/90 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-all"
                    >
                      Admin Panel
                    </button>
                    <button
                      onClick={logout}
                      className="mt-1 w-full text-left px-3 py-2 rounded-xl text-sm text-white/90 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthOpen(true);
                }}
                className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-all shadow-lg"
              >
                Sign up
              </button>
            )}
          </div>

          {/* Mobile categories sheet (only on small screens) */}
          {mobileMenuOpen && (
            <div
              ref={mobileSheetRef}
              className="absolute left-0 right-0 top-full mt-2 px-3 md:hidden"
            >
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl p-3">
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onChangeCategory(c.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`${basePill} ${
                        selectedCat === c.id ? activePill : idlePill
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {overflowCategories.length > 0 && (
                  <div className="mt-3">
                    <div className="text-white/70 text-sm mb-2">More</div>
                    <div className="flex flex-wrap gap-2">
                      {overflowCategories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            onChangeCategory(c.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`${basePill} ${idlePill}`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====== Unified AUTH MODAL ====== */}
      {authOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setAuthOpen(false)}
          />

          {/* Single Panel */}
          <div className="relative w-full max-w-md">
            {/* Back black base */}
            <div className="absolute inset-0 rounded-3xl bg-black/80 shadow-[0_20px_60px_rgba(0,0,0,0.6)]" />

            {/* Front glass card */}
            <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl p-6 text-white">
              {/* Tabs */}
              <div className="flex justify-center mb-5">
                <div className="flex bg-white/10 rounded-full p-1 border border-white/20 backdrop-blur-md">
                  <button
                    className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                      authMode === "login"
                        ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-md"
                        : "text-white/70 hover:text-white"
                    }`}
                    onClick={() => setAuthMode("login")}
                  >
                    Login
                  </button>
                  <button
                    className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                      authMode === "register"
                        ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-md"
                        : "text-white/70 hover:text-white"
                    }`}
                    onClick={() => setAuthMode("register")}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Inner unified surface */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5 min-h-[360px]">
                {authMode === "login" ? (
                  <InlineLogin onDone={() => setAuthOpen(false)} />
                ) : (
                  <InlineRegister onDone={() => setAuthOpen(false)} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* Inline versions of Login/Register to avoid nested overlays blocking clicks */
function InlineLogin({ onDone }) {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ id: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (await login(form.id.trim(), form.password)) onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="text-lg font-semibold">Sign in</div>
      <input
        className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25"
        placeholder="Email or Username"
        value={form.id}
        onChange={(e)=>setForm({...form, id: e.target.value})}
      />
      <input
        type="password"
        className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25"
        placeholder="Password"
        value={form.password}
        onChange={(e)=>setForm({...form, password: e.target.value})}
      />
      {error && <div className="text-rose-300 text-sm">{error}</div>}
      <button
        className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 font-semibold"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

function InlineRegister({ onDone }) {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({ username:"", email:"", password:"", adminKey:"" });

  const submit = async (e) => {
    e.preventDefault();
    if (await register(form.username.trim(), form.email.trim(), form.password, form.adminKey.trim())) onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="text-lg font-semibold">Create account</div>
      <input className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Username" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})}/>
      <input className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})}/>
      <input type="password" className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})}/>
      <input className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Admin Key (optional)" value={form.adminKey} onChange={(e)=>setForm({...form, adminKey:e.target.value})}/>
      {error && <div className="text-rose-300 text-sm">{error}</div>}
      <button className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-semibold" disabled={loading}>
        {loading ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
