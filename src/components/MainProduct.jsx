import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

function getCurvedArcVariants() {
  const P0 = { x: -400, y: 350 };
  const P1 = { x: 0, y: -180 };
  const P2 = { x: 0, y: 0 };
  const samples = 9;
  const xs = [], ys = [], scales = [], opacities = [], rotates = [], times = [];
  const easeBezier = (x1, y1, x2, y2, x) => {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    let u = x;
    for (let i = 0; i < 5; i++) {
      const xEval = ((ax * u + bx) * u + cx) * u - x;
      const dEval = (3 * ax * u + 2 * bx) * u + cx;
      if (Math.abs(xEval) < 1e-4) break;
      u -= xEval / dEval;
    }
    return ((ay * u + by) * u + cy) * u;
  };
  const quad = (p0, p1, p2, t) => {
    const u = 1 - t;
    return u * u * p0 + 2 * u * t * p1 + t * t * p2;
  };
  for (let i = 0; i <= samples; i++) {
    const rawT = i / samples;
    const t = easeBezier(0.22, 1, 0.36, 1, rawT);
    xs.push(quad(P0.x, P1.x, P2.x, t));
    ys.push(quad(P0.y, P1.y, P2.y, t));
    opacities.push(t);
    scales.push(0.3 + t * 0.7);
    rotates.push(-10 * (1 - Math.min(t * 1.4, 1)));
    times.push(rawT);
  }
  return {
    initial: { x: xs[0], y: ys[0], opacity: 0, scale: 0.3, rotate: -10 },
    animate: {
      x: xs,
      y: ys,
      opacity: opacities,
      scale: scales,
      rotate: rotates,
      transition: { duration: 2.0, times, ease: "easeInOut" },
    },
    exit: {
      x: [xs[xs.length - 1], xs[xs.length - 1] + 200, xs[xs.length - 1] + 300],
      y: [ys[ys.length - 1], ys[ys.length - 1] - 120, 350],
      opacity: [1, 0.5, 0],
      scale: [1, 0.7, 0.3],
      rotate: [0, 8, 12],
      transition: {
        duration: 1.2,
        times: [0, 0.5, 1],
        ease: [0.65, 0, 0.35, 1],
      },
    },
  };
}

export default function MainProduct({
  mainProduct,
  handlePrev,
  handleNext,
  reduceMotion = false,
}) {
  const { addItem } = useCart();

  const handleOrder = () => {
    if (!mainProduct) return;
    const id =
      mainProduct.id ?? mainProduct.name ?? Math.random().toString(36).slice(2);
    addItem({
      id,
      title: mainProduct.name ?? "Snack",
      price: mainProduct.price ?? 0,
      qty: 1,
      image: mainProduct.image,
    });
  };

  const curvedVariants = reduceMotion
    ? {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.95 },
      }
    : getCurvedArcVariants();

  return (
    <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-8 lg:gap-x-12 gap-y-4 mb-4 w-full overflow-hidden">
      <div className="relative shrink-0 mx-auto lg:mx-0 overflow-visible" style={{ width: 360, height: 360, maxWidth: '85vw', maxHeight: '85vw' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`main-${mainProduct?.name || 'none'}`}
            variants={curvedVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 rounded-full bg-white/15 flex items-center justify-center border border-white/20"
            style={{
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 60px rgba(255, 255, 255, 0.1)",
              backdropFilter: reduceMotion ? "blur(12px)" : "blur(40px)", WebkitBackdropFilter: reduceMotion ? "blur(12px)" : "blur(40px)"
            }}
          >
            {mainProduct?.image && (
              <motion.img
                src={mainProduct.image}
                alt={mainProduct.name}
                className="rounded-full object-cover"
                loading={reduceMotion ? 'lazy' : 'eager'}
                decoding="async"
                style={{ width: 320, height: 320, maxWidth: '75vw', maxHeight: '75vw' }}
                initial={reduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0, rotate: -10 }}
                animate={reduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1, rotate: 0 }}
                transition={reduceMotion ? { duration: 0.25 } : { delay: 0.5, duration: 0.7, type: "spring", stiffness: 100 }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="min-w-0 flex-1 w-full lg:w-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${mainProduct?.name || 'none'}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 break-words drop-shadow-lg">
              {mainProduct?.name}
              {mainProduct?.freshness && (
                <motion.span 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  className={`ml-3 px-3 py-1 text-xs font-semibold rounded-full text-white backdrop-blur-xl ${
                    mainProduct.freshness === "hot" ? "bg-red-500/90"
                    : mainProduct.freshness === "fresh" ? "bg-green-500/90"
                    : "bg-blue-500/90"
                  }`}
                >
                  {mainProduct.freshness}
                </motion.span>
              )}
            </div>
            {mainProduct?.description && (
              <div className="text-lg sm:text-xl text-white/95 break-words mb-4 leading-relaxed drop-shadow-md">{mainProduct.description}</div>
            )}
            <div className="flex items-center gap-6 mt-3 flex-wrap">
              {typeof mainProduct?.rating !== 'undefined' && (
                <span className="text-xl font-bold text-yellow-300 drop-shadow-md">{mainProduct.rating} ★</span>
              )}
              {typeof mainProduct?.price !== 'undefined' && (
                <span className="text-2xl font-bold text-white drop-shadow-md">${mainProduct.price}</span>
              )}
            </div>
            <div className="flex gap-4 mt-6 flex-wrap items-center">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-white/30 text-sm font-medium whitespace-nowrap shadow-lg transition-all border border-white/30">▶ Play video</motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOrder}
                className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full text-white hover:from-fuchsia-600 hover:to-pink-600 text-sm font-medium whitespace-nowrap shadow-lg transition-all"
              >
                🛒 Order food
              </motion.button>
              <motion.button whileHover={{ scale: 1.1, x: -3 }} whileTap={{ scale: 0.9 }} onClick={handlePrev} className="p-2.5 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 transition-all border border-white/20" style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }} aria-label="Previous product" title="Previous">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </motion.button>
              <motion.button whileHover={{ scale: 1.1, x: 3 }} whileTap={{ scale: 0.9 }} onClick={handleNext} className="p-2.5 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 transition-all border border-white/20" style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }} aria-label="Next product" title="Next">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
