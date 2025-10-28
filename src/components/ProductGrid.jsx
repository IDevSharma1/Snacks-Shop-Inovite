// src/components/ProductGrid.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

const cardShuffleVariants = {
  hidden: (i) => ({
    opacity: 0,
    scale: 0.8,
    x: Math.random() * 400 - 200,
    y: Math.random() * 300 - 150,
    rotate: Math.random() * 45 - 22.5,
  }),
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      duration: 1.1,
      delay: i * 0.15,
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  }),
  hover: { scale: 1.06, y: -6, transition: { duration: 0.2 } },
};

export default function ProductGrid({
  title,
  products,
  mainIdx,
  setMainIdx,
  setDirection,
  isLoading,
  canLoadMore,
}) {
  const { addItem } = useCart();

  return (
    <div className="w-full flex flex-col items-center pb-6 sm:pb-8 px-3 sm:px-4">
      <div className="w-full mb-1.5 mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight">
          {title}
        </h2>
      </div>

      <div
        className="
      grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4
      gap-x-8 gap-y-10 sm:gap-x-10 sm:gap-y-12 lg:gap-x-12 lg:gap-y-14
      px-2 sm:px-4 lg:px-6 py-6 w-full
    "
      >
        <AnimatePresence>
          {products.map((dish, idx) => (
            <motion.div
              key={`${dish.name}-${idx}`}
              custom={idx}
              variants={cardShuffleVariants}
              initial={idx >= 6 ? "hidden" : false}
              animate="visible"
              whileHover="hover"
              className={`relative rounded-2xl overflow-hidden bg-white/10 transition-all border aspect-square
                p-3 sm:p-4
                ${
                  mainIdx === idx
                    ? "ring-2 ring-fuchsia-400 bg-white/20 shadow-xl border-white/30"
                    : "border-white/15 hover:bg-white/15 hover:border-white/25 shadow-lg"
                }`}
              onClick={() => {
                const diff = idx - mainIdx;
                if (diff > 0) setDirection(1);
                else if (diff < 0) setDirection(-1);
                setMainIdx(idx);
              }}
            >
              <div className="w-full h-full relative rounded-xl overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0">
                  <div className="mx-0.5 mb-0.5 rounded-md bg-black/35 backdrop-blur-sm px-2 py-1">
                    <div className="text-[11px] sm:text-xs font-semibold text-white text-center truncate">
                      {dish.name}
                    </div>
                  </div>
                </div>

                {/* Quick add button (does not stop selecting on card click) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const id = dish.id ?? dish.name ?? `${idx}`;
                    addItem({
                      id,
                      title: dish.name ?? "Snack",
                      price: dish.price ?? 0,
                      qty: 1,
                      image: dish.image
                    });
                  }}
                  className="absolute top-2 right-2 rounded-full border border-white/30 bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl px-3 py-1 text-xs font-semibold shadow"
                >
                  + Add
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isLoading && (
        <div className="mt-4 text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2">Loading more snacks...</p>
        </div>
      )}
      {canLoadMore && !isLoading && (
        <div className="mt-6 text-white/80 text-center">
          <p className="text-sm">Scroll down to see more delicious items! 🍽️</p>
        </div>
      )}
    </div>
  );
}
