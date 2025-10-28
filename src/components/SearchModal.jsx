import React, { useEffect, useRef, useState } from "react";

export default function SearchModal({ open, onClose, onSelect }) {
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => ref.current?.focus(), 50);
    } else {
      setQ("");
    }
  }, [open]);

  const results = q
    ? [
        { id: "burger", title: "Cheesy Burger", price: 8.49 },
        { id: "fries", title: "Crispy Fries", price: 3.99 },
      ].filter((x) => x.title.toLowerCase().includes(q.toLowerCase()))
    : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl p-3 sm:p-4">
        <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
          </svg>
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search snacks…"
            className="w-full bg-transparent outline-none text-white placeholder:text-white/60"
          />
          <button onClick={onClose} className="px-2 py-1 text-white/80 hover:text-white">Esc</button>
        </div>

        <ul className="mt-3 max-h-80 overflow-y-auto">
          {results.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => {
                  onSelect?.(r);
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-white/90 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-all"
              >
                {r.title} • ${r.price.toFixed(2)}
              </button>
            </li>
          ))}
          {q && results.length === 0 && (
            <li className="px-3 py-3 text-white/70">No results</li>
          )}
        </ul>
      </div>
    </div>
  );
}
