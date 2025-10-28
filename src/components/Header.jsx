// src/components/Header.jsx
import React, { useEffect, useRef } from "react";
import { useCart } from "./CartContext";

export default function Header({
  categories = [],
  overflowCategories = [],
  selectedCat,
  onChangeCategory,
  showDropdown,
  setShowDropdown,
  onOpenSearch = () => {},
  onOpenCart = () => {}
}) {
  const menuRef = useRef(null);
  const { count } = useCart();

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [setShowDropdown]);

  const basePill =
    "px-3 py-1.5 rounded-full text-sm font-medium transition-all border backdrop-blur-xl";
  const activePill =
    "bg-white/25 text-white border-white/40 shadow-lg";
  const idlePill =
    "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border-white/20";

  return (
    <header className="w-full sticky top-1 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="grid grid-cols-3 items-center
                     rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl
                     shadow-[0_10px_40px_rgba(0,0,0,0.18)]
                     px-5 sm:px-6 py-3"
        >
          <div className="flex items-center min-w-0">
            <div className="text-white font-black tracking-tight text-xl sm:text-2xl">
              SnackShop
            </div>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                className={`${basePill} ${selectedCat === c.id ? activePill : idlePill}`}
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
                  aria-expanded={showDropdown}
                  aria-haspopup="menu"
                >
                  More
                  <span className="text-xs opacity-80">{overflowCategories.length}</span>
                </button>

                {showDropdown && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl p-2
                               before:content-[''] before:absolute before:-top-2 before:right-6 before:w-4 before:h-4
                               before:bg-white/10 before:backdrop-blur-2xl before:border before:border-white/20 before:rotate-45 before:rounded-sm"
                  >
                    <ul className="max-h-[60vh] overflow-y-auto pr-1">
                      {overflowCategories.map((c) => (
                        <li key={c.id} className="p-1">
                          <button
                            className="w-full text-left px-3 py-2 rounded-xl text-sm text-white/90 hover:text-white
                                       bg-white/5 hover:bg-white/15 border border-white/10 transition-all"
                            onClick={() => onChangeCategory(c.id)}
                            role="menuitem"
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

          <div className="flex items-center justify-end gap-2">
            <button
              aria-label="Search"
              className="h-9 w-9 flex items-center justify-center rounded-full border-2 border-white/25
                         bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-xl transition-all"
              onClick={onOpenSearch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
              </svg>
            </button>

            <button
  aria-label="Cart"
  className="h-9 w-9 flex items-center justify-center rounded-full border-2 border-white/25
             bg-white/10 hover:bg-white/20 text-white/90 hover:text-white
             backdrop-blur-xl transition-all relative"
  onClick={onOpenCart}
>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/90 text-black font-semibold">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden mt-2">
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className={`${basePill} ${idlePill} w-full rounded-2xl`}
          >
            Categories
          </button>
        </div>
      </div>
    </header>
  );
}
