import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { datasets } from './data/products';
import bgVideo from './assets/bg.mp4';

const categories = [
  { id: "Salty", icon: "🥨", name: "Salty" },
  { id: "Sweet", icon: "🍬", name: "Sweet" },
  { id: "Healthy", icon: "🥗", name: "Healthy" },
  { id: "Drinks", icon: "🥤", name: "Drinks" }
];

function App() {
  const [selectedCat, setSelectedCat] = useState("Salty");
  const [mainIdx, setMainIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = async () => {
      try {
        await v.play();
      } catch (err) {
        console.warn('Background video play failed:', err);
      }
    };
    tryPlay();
  }, []);

  const dishes = datasets[selectedCat] || [];
  const mainProduct = dishes[mainIdx] || {};

  const handleNext = () => {
    setDirection(1);
    setMainIdx((prev) => (prev + 1) % dishes.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setMainIdx((prev) => (prev - 1 + dishes.length) % dishes.length);
  };

  const handleCategoryChange = (catId) => {
    setSelectedCat(catId);
    setMainIdx(0);
    setDirection(1);
  };

  // Curved arc path: bottom scroller area → navbar top → final position
  // Curved arc path: bottom scroller area → navbar top → final position
const getCurvedArcVariants = () => {
  // Control points (adjust if you need to fine-tune the arc height/width)
  const P0 = { x: -400, y: 350 };   // start
  const P1 = { x: 0,    y: -180 };  // peak (navbar center)
  const P2 = { x: 0,    y: 0 };     // end

  // Sample a smooth quadratic Bezier with one global easing
  const samples = 9; // more samples = smoother curve
  const xs = [];
  const ys = [];
  const scales = [];
  const opacities = [];
  const rotates = [];
  const times = [];

  // cubic-bezier(0.22, 1, 0.36, 1)
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
    return u*u*p0 + 2*u*t*p1 + t*t*p2;
  };

  for (let i = 0; i <= samples; i++) {
    const rawT = i / samples;
    const t = easeBezier(0.22, 1, 0.36, 1, rawT); // one global ease

    xs.push(quad(P0.x, P1.x, P2.x, t));
    ys.push(quad(P0.y, P1.y, P2.y, t));

    // Progressive transforms bound to the same t
    opacities.push(0 + t * 1);               // 0 → 1
    scales.push(0.3 + t * (1 - 0.3));        // 0.3 → 1
    rotates.push(-10 * (1 - Math.min(t * 1.4, 1))); // -10° → 0° faster early

    times.push(rawT); // keyframe times uniformly 0..1
  }

  return {
    initial: {
      x: xs[0],
      y: ys[0],
      opacity: 0,
      scale: 0.3,
      rotate: -10
    },
    animate: {
      x: xs,
      y: ys,
      opacity: opacities,
      scale: scales,
      rotate: rotates,
      transition: {
        duration: 2.0,
        times,
        ease: "linear" // already eased in samples; keep linear here to avoid wobble
      }
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
        ease: [0.65, 0, 0.35, 1]
      }
    }
  };
};


  const visibleProducts = dishes.slice(0, 6);

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden">
      <video
        ref={videoRef}
        className="pointer-events-none fixed inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 z-10" />

      <div className="w-full min-h-screen flex flex-col relative z-20 overflow-x-hidden">
        <header className="sticky top-0 z-30 w-full left-0 right-0">
          <div
            className="w-full flex items-center justify-between px-6 sm:px-8 md:px-10 min-h-[70px] backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg"
            style={{
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)"
            }}
          >
            <motion.div 
              className="shrink-0 text-2xl font-bold text-white tracking-tight"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              SnackShop
            </motion.div>

            <nav className="mx-2 flex-1 hidden md:flex justify-center">
              <div className="flex gap-3">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-xl transition-all duration-300
                      ${selectedCat === cat.id
                        ? "bg-white/80 text-gray-900 shadow-xl ring-2 ring-fuchsia-400"
                        : "bg-white/20 text-white hover:bg-white/30 shadow-md"}`}
                    style={{ 
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)"
                    }}
                    aria-pressed={selectedCat === cat.id}
                  >
                    <span className="mr-2">{cat.icon}</span>{cat.name}
                  </motion.button>
                ))}
              </div>
            </nav>

            <div className="shrink-0 flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 shadow-lg transition-all"
                aria-label="Search"
                title="Search"
              >
                🔍
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:from-fuchsia-600 hover:to-pink-600 shadow-lg transition-all"
                aria-label="Cart"
                title="Cart"
              >
                🛒
              </motion.button>
            </div>
          </div>

          <div className="w-full md:hidden px-4 py-3 bg-white/5 backdrop-blur-xl border-b border-white/10">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl transition-all whitespace-nowrap
                    ${selectedCat === cat.id
                      ? "bg-white/80 text-gray-900 ring-2 ring-fuchsia-400 shadow-lg"
                      : "bg-white/20 text-white hover:bg-white/30"}`}
                  aria-pressed={selectedCat === cat.id}
                >
                  <span className="mr-1.5">{cat.icon}</span>{cat.name}
                </motion.button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row w-full overflow-hidden">
          <div className="flex-1 flex flex-col p-4 sm:p-5 w-full overflow-hidden">
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-8 lg:gap-x-12 gap-y-4 mb-4 w-full overflow-hidden">
              <div 
                className="relative shrink-0 mx-auto lg:mx-0 overflow-visible" 
                style={{ width: 360, height: 360, maxWidth: '85vw', maxHeight: '85vw' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedCat}-${mainIdx}`}
                    variants={getCurvedArcVariants()}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0 rounded-full bg-white/15 backdrop-blur-2xl flex items-center justify-center border border-white/20"
                    style={{
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 60px rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)"
                    }}
                  >
                    {mainProduct?.image && (
                      <motion.img
                        src={mainProduct.image}
                        alt={mainProduct.name}
                        className="rounded-full object-cover"
                        style={{
                          width: 320,
                          height: 320,
                          maxWidth: '75vw',
                          maxHeight: '75vw'
                        }}
                        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.5, duration: 0.7, type: "spring", stiffness: 100 }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="min-w-0 flex-1 w-full lg:w-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${selectedCat}-${mainIdx}`}
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
                            mainProduct.freshness === "hot"
                              ? "bg-red-500/90"
                              : mainProduct.freshness === "fresh"
                              ? "bg-green-500/90"
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
                    <div className="flex gap-4 mt-6 flex-wrap">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-white/30 text-sm font-medium whitespace-nowrap shadow-lg transition-all border border-white/30"
                      >
                        ▶ Play video
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full text-white hover:from-fuchsia-600 hover:to-pink-600 text-sm font-medium whitespace-nowrap shadow-lg transition-all"
                      >
                        🛒 Order food
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="w-full flex items-center gap-3 pb-4 overflow-hidden mt-2">
              <motion.button
                whileHover={{ scale: 1.1, x: -3 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="flex-shrink-0 p-2.5 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 transition-all border border-white/20"
                style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}
                aria-label="Previous product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <div className="flex-1 flex justify-center items-center">
                <div className="grid grid-cols-6 gap-2 w-full max-w-[800px]">
                  {visibleProducts.map((dish, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center p-2 rounded-xl cursor-pointer backdrop-blur-xl bg-white/15
                        transition-all border ${mainIdx === idx ? "ring-2 ring-fuchsia-400 bg-white/25 shadow-xl" : "border-white/20 hover:bg-white/25 shadow-lg"}
                      `}
                      onClick={() => {
                        const diff = idx - mainIdx;
                        if (diff > 0) {
                          setDirection(1);
                        } else if (diff < 0) {
                          setDirection(-1);
                        }
                        setMainIdx(idx);
                      }}
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-16 h-16 rounded-lg object-cover mb-1.5 shadow-md"
                      />
                      <div className="text-[10px] font-bold text-white text-center w-full break-words leading-tight px-1">{dish.name}</div>
                      <div className="mt-1 font-bold text-white whitespace-nowrap text-xs">${dish.price}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, x: 3 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="flex-shrink-0 p-2.5 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 transition-all border border-white/20"
                style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}
                aria-label="Next product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>

          <div className="w-full lg:w-96 flex flex-col items-center pt-4 lg:pt-6 px-4 pb-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-[340px] rounded-3xl bg-white/10 backdrop-blur-2xl p-8 border border-white/20"
              style={{
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)"
              }}
            >
              <div className="flex justify-between text-sm font-semibold mb-8 border-b border-white/20 pb-4">
                <span className="text-white/90 cursor-pointer hover:text-white transition-all">Overview</span>
                <span className="text-white/60 cursor-pointer hover:text-white transition-all">Ingredients</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`sidebar-${selectedCat}-${mainIdx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <div className="flex items-start gap-5 mb-8">
                    {typeof mainProduct?.rating !== 'undefined' && (
                      <div className="text-5xl sm:text-6xl font-black text-yellow-300 shrink-0 drop-shadow-lg">{mainProduct.rating}★</div>
                    )}
                    <div className="min-w-0 flex-1">
                      {mainProduct?.name && (
                        <div className="font-bold text-lg sm:text-xl text-white break-words mb-2">{mainProduct.name}</div>
                      )}
                      {mainProduct?.description && (
                        <div className="text-sm text-white/80 break-words leading-relaxed">{mainProduct.description}</div>
                      )}
                      {typeof mainProduct?.price !== 'undefined' && (
                        <div className="font-bold text-white mt-3 text-lg">${mainProduct.price}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-full bg-white/80 text-gray-900 hover:bg-white text-sm font-medium whitespace-nowrap shadow-lg transition-all"
                  aria-label="Like this product"
                  title="Like"
                >
                  👍 Like
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 text-sm font-medium whitespace-nowrap shadow-lg transition-all border border-white/30"
                  aria-label="Dislike this product"
                  title="Dislike"
                >
                  👎 Dislike
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
