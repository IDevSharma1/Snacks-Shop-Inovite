import React, { useEffect, useRef, useState } from "react";

const API = (import.meta?.env?.VITE_API_BASE) || "http://localhost:5000/api";

// simple debounce
function useDebouncedValue(value, delay=300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchModal({ open, onClose, onSelect }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]); // [{_id, name, price, imageURL}]
  const [error, setError] = useState("");
  const ref = useRef(null);

  const qDebounced = useDebouncedValue(q, 300);

  useEffect(() => {
    if (open) {
      setTimeout(() => ref.current?.focus(), 50);
    } else {
      setQ("");
      setResults([]);
      setError("");
      setLoading(false);
    }
  }, [open]);

  // fetch results from backend across all categories
  useEffect(() => {
    let abort = false;
    async function run() {
      if (!open) return;
      if (!qDebounced?.trim()) {
        setResults([]);
        setError("");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const qs = new URLSearchParams();
        qs.set("q", qDebounced.trim());
        // return plenty so user sees all matches
        qs.set("page", "1");
        qs.set("limit", "50");
        const res = await fetch(`${API}/products?${qs.toString()}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!abort) {
          setResults((data.items || []).map(p => ({
            id: p._id,
            title: p.name,
            price: p.price,
            image: p.imageURL,
            raw: p
          })));
        }
      } catch (e) {
        if (!abort) setError("Failed to search");
      } finally {
        if (!abort) setLoading(false);
      }
    }
    run();
    return () => { abort = true; };
  }, [qDebounced, open]);

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
          {loading && <li className="px-3 py-3 text-white/70">Searching…</li>}
          {!loading && error && <li className="px-3 py-3 text-rose-300">{error}</li>}

          {!loading && !error && results.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => {
                  // hand back full item so home can render it as main product
                  onSelect?.(r.raw);
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-white/90 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-all flex items-center gap-3"
              >
                {r.image && (
                  <img src={r.image} alt={r.title} className="h-8 w-8 rounded-md object-cover" />
                )}
                <span className="flex-1 truncate">{r.title}</span>
                <span className="shrink-0">${Number(r.price || 0).toFixed(2)}</span>
              </button>
            </li>
          ))}

          {q && !loading && !error && results.length === 0 && (
            <li className="px-3 py-3 text-white/70">No results</li>
          )}
        </ul>
      </div>
    </div>
  );
}
