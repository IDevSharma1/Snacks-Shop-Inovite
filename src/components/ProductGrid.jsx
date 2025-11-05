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
  hover: { scale: 1.05, y: -4, transition: { duration: 0.2 } },
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
    <div className="w-full flex flex-col items-center pb-6 sm:pb-8 px-2 sm:px-3 lg:px-4 xl:px-6">
      <div className="w-full mb-2 mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
          {title}
        </h2>
      </div>

      <div
        className="
          grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4
          gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-10 lg:gap-x-10 lg:gap-y-12
          w-full mx-auto
          px-0 sm:px-2 lg:px-2 py-4
        "
      >
        <AnimatePresence>
  {products.map((dish, idx) => (
    <motion.div
      key={dish.id ?? `${dish.name}-${idx}`}     // prefer stable DB id
      custom={idx}
      variants={cardShuffleVariants}
      initial={idx >= 6 ? "hidden" : false}
      animate="visible"
      whileHover="hover"
      className={`relative rounded-xl overflow-hidden bg-white/10 transition-all border
        aspect-[1/1.1] p-2 sm:p-3
        ${
          mainIdx === idx
            ? "ring-2 ring-fuchsia-400 bg-white/20 shadow-lg border-white/40"
            : "border-white/20 hover:bg-white/15 hover:border-white/30 shadow-md"
        }`}
      onClick={() => {
        const diff = idx - mainIdx;
        if (diff > 0) setDirection(1);
        else if (diff < 0) setDirection(-1);
        setMainIdx(idx);
      }}
    >
      <div className="w-full h-full relative rounded-lg overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-300 rounded-lg"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-1 mb-1 rounded-md bg-black/40 backdrop-blur-sm px-2 py-1.5">
            <div className="text-[11px] sm:text-xs font-semibold text-white text-center truncate">
              {dish.name}
            </div>
          </div>
        </div>

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
              image: dish.image,
            });
          }}
          className="absolute top-2.5 right-2.5 rounded-full border border-white/40 bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl px-3 py-1 text-xs font-semibold shadow-sm"
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
          <p className="mt-2 text-sm">Loading more snacks...</p>
        </div>
      )}
      {canLoadMore && !isLoading && (
        <div className="mt-5 text-white/80 text-center">
          <p className="text-sm">Scroll down to see more delicious items! 🍽️</p>
        </div>
      )}
    </div>
  );
}
