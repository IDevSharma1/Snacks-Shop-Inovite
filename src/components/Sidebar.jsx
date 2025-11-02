import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ mainProduct }) {
  return (
    <div className="w-full lg:w-[22rem] shrink-0 overflow-x-hidden">
      <div className="lg:sticky lg:top-4">
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-[340px] h-[400px] flex flex-col rounded-3xl bg-white/10 backdrop-blur-2xl p-8 border border-white/20 overflow-hidden"
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
        }}
      >
        <div className="flex justify-between text-sm font-semibold mb-8 border-b border-white/20 pb-4">
          <span className="text-white/90 cursor-pointer hover:text-white transition-all">Overview</span>
          <span className="text-white/60 cursor-pointer hover:text-white transition-all">Ingredients</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`sidebar-${mainProduct?.name || "none"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex-1 overflow-y-auto pr-1"
          >
            <div className="flex items-start gap-5 mb-8">
              {typeof mainProduct?.rating !== "undefined" && (
                <div className="text-5xl sm:text-6xl font-black text-yellow-300 shrink-0 drop-shadow-lg">
                  {mainProduct.rating}★
                </div>
              )}
              <div className="min-w-0 flex-1">
                {mainProduct?.name && (
                  <div className="font-bold text-lg sm:text-xl text-white break-words mb-2">
                    {mainProduct.name}
                  </div>
                )}
                {mainProduct?.description && (
                  <div className="text-sm text-white/80 break-words leading-relaxed">
                    {mainProduct.description}
                  </div>
                )}
                {typeof mainProduct?.price !== "undefined" && (
                  <div className="font-bold text-white mt-3 text-lg">${mainProduct.price}</div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full bg-white/80 text-gray-900 hover:bg-white text-sm font-medium whitespace-nowrap shadow-lg transition-all"
          >
            👍 Like
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 text-sm font-medium whitespace-nowrap shadow-lg transition-all border border-white/30"
          >
            👎 Dislike
          </motion.button>
        </div>
      </motion.div>
    {/* existing motion.div */}
  </div>
</div>
  );
}
