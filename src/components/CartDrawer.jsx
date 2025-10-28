// src/components/CartDrawer.jsx
import React from "react";
import { useCart } from "./CartContext";

export default function CartDrawer({ open, onClose }) {
  const { cart, removeItem, clearCart } = useCart();
  const items = Array.from(cart.values());
  const subtotal = items.reduce((s, it) => s + (it.price ?? 0) * (it.qty ?? 1), 0);

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}>
      {/* overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      {/* panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-[22rem] max-w-[90vw]
                    bg-white/10 backdrop-blur-2xl border-l border-white/20
                    shadow-2xl text-white
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/15">
          <h3 className="text-lg font-bold">Your Cart</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-9rem)]">
          {items.length === 0 && <p className="text-white/80">Your cart is empty.</p>}

          {items.map((it) => (
            <div key={it.id} className="flex gap-3 items-center rounded-xl border border-white/15 bg-white/10 p-3">
              {it.image && <img src={it.image} alt={it.title} className="h-14 w-14 rounded-lg object-cover" />}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{it.title}</p>
                <p className="text-xs text-white/80">Qty: {it.qty} • ${((it.price ?? 0) * (it.qty ?? 1)).toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeItem(it.id)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs border border-white/20"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/15">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Subtotal</span>
            <span className="text-sm font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearCart}
              className="w-1/3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-2 text-sm"
            >
              Clear
            </button>
            <button className="w-2/3 rounded-xl bg-pink-600 hover:bg-pink-500 px-3 py-2 text-sm font-semibold">
              Checkout
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
