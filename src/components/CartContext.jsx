// src/components/CartContext.jsx
import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const key = action.item.id;
      const next = new Map(state);
      const existing = next.get(key);
      const qty = (existing?.qty ?? 0) + (action.item.qty ?? 1);
      next.set(key, { ...action.item, qty });
      return next;
    }
    case "REMOVE": {
      const next = new Map(state);
      next.delete(action.id);
      return next;
    }
    case "CLEAR":
      return new Map();
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, new Map());

  const addItem = useCallback((item) => {
    dispatch({ type: "ADD", item });
    toast.success(`${item.title ?? "Item"} added to cart`, { position: "top-right" });
  }, []);

  const removeItem = useCallback((id) => {
    dispatch({ type: "REMOVE", id });
    toast.success("Removed from cart", { position: "top-right" });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
    toast.success("Cart cleared", { position: "top-right" });
  }, []);

  const count = useMemo(() => {
    let c = 0;
    cart.forEach((v) => (c += v.qty ?? 0));
    return c;
  }, [cart]);

  const value = useMemo(
    () => ({ cart, addItem, removeItem, clearCart, count }),
    [cart, addItem, removeItem, clearCart, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
