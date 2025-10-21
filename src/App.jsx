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

  const getCircularVariants = () => {
    const radius = 500;
    
    if (direction === 1) {
      return {
        initial: {
          x: 0,
          y: radius,
          opacity: 0,
          scale: 0.3,
        },
        animate: {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 80,
            damping: 20,
            duration: 0.8
          }
        },
        exit: {
          x: 0,
          y: -radius,
          opacity: 0,
          scale: 0.3,
          transition: {
            type: "spring",
            stiffness: 80,
            damping: 20,
            duration: 0.8
          }
        }
      };
    } else {
      return {
        initial: {
          x: radius,
          y: 0,
          opacity: 0,
          scale: 0.3,
        },
        animate: {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 80,
            damping: 20,
            duration: 0.8
          }
        },
        exit: {
          x: -radius,
          y: 0,
          opacity: 0,
          scale: 0.3,
          transition: {
            type: "spring",
            stiffness: 80,
            damping: 20,
            duration: 0.8
          }
        }
      };
    }
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

      <div className="pointer-events-none fixed inset-0 bg-black/30 z-10" />

      <div className="w-full min-h-screen flex flex-col relative z-20 overflow-x-hidden">
        <header className="sticky top-0 z-30 w-full left-0 right-0">
          <div
            className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8 min-h-[72px] backdrop-blur-md bg-white/20 border-b border-white/30"
            style={{
              boxShadow: "0 2px 24px 0 rgba(80,80,120,0.07)",
              border: "1px solid rgba(255,255,255,0.21)",
              backgroundClip: "padding-box"
            }}
          >
            <div className="shrink-0 text-xl font-bold text-white">
              SnackShop
            </div>

            <nav className="mx-2 flex-1 hidden md:flex justify-center">
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-sm backdrop-blur-md transition
                      ${selectedCat === cat.id
                        ? "bg-white/70 text-gray-900 ring-2 ring-fuchsia-400"
                        : "bg-white/30 text-white hover:bg-white/50"}`}
                    style={{ backgroundClip: "padding-box" }}
                    aria-pressed={selectedCat === cat.id}
                  >
                    <span className="mr-1">{cat.icon}</span>{cat.name}
                  </button>
                ))}
              </div>
            </nav>

            <div className="shrink-0 flex items-center gap-2">
              <button
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
                aria-label="Search"
                title="Search"
              >
                🔍
              </button>
              <button
                className="p-2 rounded-full bg-black text-white hover:bg-gray-800"
                aria-label="Cart"
                title="Cart"
              >
                🛒
              </button>
            </div>
          </div>

          <div className="w-full md:hidden px-4 py-2 bg-white/10 backdrop-blur-md">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm backdrop-blur-md transition whitespace-nowrap
                    ${selectedCat === cat.id
                      ? "bg-white/70 text-gray-900 ring-2 ring-fuchsia-400"
                      : "bg-white/30 text-white hover:bg-white/50"}`}
                  style={{ backgroundClip: "padding-box" }}
                  aria-pressed={selectedCat === cat.id}
                >
                  <span className="mr-1">{cat.icon}</span>{cat.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row w-full overflow-hidden">
          <div className="flex-1 flex flex-col p-4 sm:p-6 w-full overflow-hidden">
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-8 lg:gap-x-16 gap-y-6 mb-6 w-full overflow-hidden">
              <div 
                className="relative shrink-0 mx-auto lg:mx-0 overflow-hidden" 
                style={{ width: 340, height: 340, maxWidth: '85vw', maxHeight: '85vw' }}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`${selectedCat}-${mainIdx}`}
                    custom={direction}
                    variants={getCircularVariants()}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0 rounded-full bg-white/30 backdrop-blur-xl flex items-center justify-center"
                    style={{
                      boxShadow: "0 8px 48px 0 rgba(0,0,0,0.18)",
                      backgroundClip: "padding-box"
                    }}
                  >
                    {mainProduct?.image && (
                      <img
                        src={mainProduct.image}
                        alt={mainProduct.name}
                        className="rounded-full object-cover"
                        style={{
                          width: 300,
                          height: 300,
                          maxWidth: '75vw',
                          maxHeight: '75vw'
                        }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="min-w-0 flex-1 w-full lg:w-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${selectedCat}-${mainIdx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 break-words">
                      {mainProduct?.name}
                      {mainProduct?.freshness && (
                        <span className={`ml-2 px-2 py-1 text-xs rounded text-white ${
                          mainProduct.freshness === "hot"
                            ? "bg-red-400"
                            : mainProduct.freshness === "fresh"
                            ? "bg-green-400"
                            : "bg-blue-400"
                        }`}>
                          {mainProduct.freshness}
                        </span>
                      )}
                    </div>
                    {mainProduct?.description && (
                      <div className="text-base sm:text-lg text-white/90 break-words">{mainProduct.description}</div>
                    )}
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      {typeof mainProduct?.rating !== 'undefined' && (
                        <span className="text-lg font-bold text-fuchsia-300">{mainProduct.rating} ★</span>
                      )}
                      {typeof mainProduct?.price !== 'undefined' && (
                        <span className="font-bold text-white">₹{mainProduct.price}</span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-4 flex-wrap">
                      <button className="px-4 py-1 bg-white/20 rounded-full text-white hover:bg-white/30 text-sm whitespace-nowrap">
                        ▶ Play video
                      </button>
                      <button className="px-4 py-1 bg-black rounded-full text-white hover:bg-gray-800 text-sm whitespace-nowrap">
                        🛒 Order food
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="w-full flex items-center gap-4 pb-4 overflow-hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="flex-shrink-0 p-3 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
                aria-label="Previous product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 sm:gap-6 justify-start">
                  {visibleProducts.map((dish, idx) => (
                    <button
                      key={idx}
                      className={`flex flex-col items-center p-3 rounded-2xl cursor-pointer backdrop-blur-md bg-white/40
                        transition flex-shrink-0 ${mainIdx === idx ? "ring-2 ring-fuchsia-400" : "hover:ring-2 hover:ring-fuchsia-200"}
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
                      style={{ backgroundClip: "padding-box" }}
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-16 h-16 rounded-xl object-cover mb-2"
                      />
                      <div className="text-xs font-bold text-white text-center w-24 break-words">{dish.name}</div>
                      <div className="mt-1 font-bold text-white/90 whitespace-nowrap">₹{dish.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="flex-shrink-0 p-3 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
                aria-label="Next product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>

          <div className="w-full lg:w-96 flex flex-col items-center pt-6 lg:pt-10 px-4 pb-6">
            <div
              className="w-full max-w-[320px] rounded-3xl bg-white/20 backdrop-blur-md p-6 sm:p-8"
              style={{
                boxShadow: "0 16px 32px 0 rgba(80,80,120,0.07)",
                backgroundClip: "padding-box"
              }}
            >
              <div className="flex justify-between text-sm font-semibold mb-6">
                <span className="text-white/80">Overview</span>
                <span className="text-white/80">Ingredients</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`sidebar-${selectedCat}-${mainIdx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    {typeof mainProduct?.rating !== 'undefined' && (
                      <div className="text-4xl sm:text-5xl font-black text-fuchsia-300 shrink-0">{mainProduct.rating}★</div>
                    )}
                    <div className="min-w-0 flex-1">
                      {mainProduct?.name && (
                        <div className="font-semibold text-base sm:text-lg text-white break-words">{mainProduct.name}</div>
                      )}
                      {mainProduct?.description && (
                        <div className="text-xs text-white/80 break-words">{mainProduct.description}</div>
                      )}
                      {typeof mainProduct?.price !== 'undefined' && (
                        <div className="font-bold text-white mt-2">₹{mainProduct.price}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full bg-white/70 text-gray-900 hover:bg-white text-sm whitespace-nowrap"
                  aria-label="Like this product"
                  title="Like"
                >
                  👍 Like
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full bg-white/30 text-white hover:bg-white/50 text-sm whitespace-nowrap"
                  aria-label="Dislike this product"
                  title="Dislike"
                >
                  👎 Dislike
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;



