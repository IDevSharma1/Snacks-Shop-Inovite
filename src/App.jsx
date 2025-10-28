// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { datasets } from "./data/products";
import bgVideo from "./assets/bg.mp4";
import Header from "./components/Header";
import MainProduct from "./components/MainProduct";
import ProductGrid from "./components/ProductGrid";
import Sidebar from "./components/Sidebar";
import SearchModal from "./components/SearchModal";
import { CartProvider, useCart } from "./components/CartContext";
import CartDrawer from "./components/CartDrawer";

const categories = [
  { id: "Salty", name: "Salty" }, { id: "Sweet", name: "Sweet" }, { id: "Healthy", name: "Healthy" },
  { id: "Drinks", name: "Drinks" }, { id: "Chips", name: "Chips" }, { id: "Biscuits", name: "Biscuits" },
  { id: "Nuts", name: "Nuts" }, { id: "Baked", name: "Baked" }, { id: "Candies", name: "Candies" },
  { id: "Spicy", name: "Spicy" }, { id: "Fruits", name: "Fruits" }, { id: "Icecream", name: "Ice Cream" },
  { id: "Sandwich", name: "Sandwich" }, { id: "Pizza", name: "Pizza" }, { id: "Burger", name: "Burger" },
  { id: "Wraps", name: "Wraps" }, { id: "Soup", name: "Soup" }, { id: "Pasta", name: "Pasta" },
  { id: "Donuts", name: "Donuts" }, { id: "Sushi", name: "Sushi" }
];

function AppInner() {
  const [selectedCat, setSelectedCat] = useState("Salty");
  const [mainIdx, setMainIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const videoRef = useRef(null);
  const [cartOpen, setCartOpen] = useState(false);

  const visibleCats = categories.slice(0, 5);
  const overflowCats = categories.slice(5);

  const dishes = datasets[selectedCat] || [];
  const mainProduct = dishes[mainIdx] || {};
  const visibleProducts = dishes.slice(0, visibleCount);

  // Performance heuristics: detect low-memory / few cores or reduced motion preference
  const [reduceMotion, setReduceMotion] = useState(false);
  const [enableVideo, setEnableVideo] = useState(true);

  useEffect(() => {
    try {
      const lowMem = navigator.deviceMemory && navigator.deviceMemory <= 2;
      const fewCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (lowMem || fewCores || prefersReduced) setReduceMotion(true);
      if (lowMem || fewCores || prefersReduced) setEnableVideo(false);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.play?.().catch(() => {});
  }, []);

  useEffect(() => {
    setVisibleCount(6);
    setMainIdx(0);
  }, [selectedCat]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= docHeight * 0.7) loadMore();
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [visibleCount, selectedCat, isLoading]);

  const loadMore = () => {
    if (isLoading || visibleCount >= dishes.length) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((p) => Math.min(p + 12, dishes.length));
      setIsLoading(false);
    }, 300);
  };

  const handleNext = () => {
    setDirection(1);
    setMainIdx((p) => (p + 1) % dishes.length);
  };
  const handlePrev = () => {
    setDirection(-1);
    setMainIdx((p) => (p - 1 + dishes.length) % dishes.length);
  };
  const handleCategoryChange = (catId) => {
    setSelectedCat(catId);
    setMainIdx(0);
    setDirection(1);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden">
      {enableVideo && (
      <video
        ref={videoRef}
        className="pointer-events-none fixed inset-0 w-full h-full object-cover z-0"
        autoPlay muted loop playsInline preload="metadata"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      )}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 z-10" />

      <div className="w-full min-h-screen flex flex-col relative z-20 overflow-x-hidden">
        <Header
          categories={visibleCats}
          overflowCategories={overflowCats}
          selectedCat={selectedCat}
          onChangeCategory={handleCategoryChange}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenCart={() => setCartOpen(true)}
        />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        <div className="flex flex-1 w-full lg:flex-row flex-col items-stretch min-h-[80vh] gap-6 lg:gap-8 px-4 lg:px-8 py-6">
          <div className="flex-1 min-w-0">
            <div className="mx-auto w-full">
              <MainProduct
                mainProduct={mainProduct}
                handleNext={handleNext}
                handlePrev={handlePrev}
                reduceMotion={reduceMotion}
              />
              <ProductGrid
                title={`Trending Snacks (${visibleCount} of ${dishes.length})`}
                products={visibleProducts}
                mainIdx={mainIdx}
                setMainIdx={setMainIdx}
                setDirection={setDirection}
                isLoading={isLoading}
                canLoadMore={visibleCount < dishes.length}
                reduceMotion={reduceMotion}
              />
            </div>
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <Sidebar mainProduct={mainProduct} />
          </div>
        </div>
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(item) => {
          // optional: do something when selecting from search
          console.log("Selected:", item);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Toaster />
      <AppInner />
    </CartProvider>
  );
}
