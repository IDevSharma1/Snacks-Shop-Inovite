import React, { useState, useRef, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import bgVideo from "./assets/bg.webm";
import Header from "./components/Header";
import MainProduct from "./components/MainProduct";
import ProductGrid from "./components/ProductGrid";
import Sidebar from "./components/Sidebar";
import SearchModal from "./components/SearchModal";
import { CartProvider } from "./components/CartContext";
import CartDrawer from "./components/CartDrawer";
import { apiGet } from "./api";

function SmartPicks({ onSelectProduct, recent = [], highlight }) {
  return (
    <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl p-4 text-white">
      <div className="font-semibold mb-2">Smart Picks</div>

      {highlight && (
        <div className="mb-4 rounded-xl bg-white/10 border border-white/20 p-3 flex items-center gap-3">
          {highlight.imageURL && (
            <img src={highlight.imageURL} alt={highlight.name} className="h-12 w-12 rounded-md object-cover" />
          )}
          <div className="flex-1 min-w-0">
            <div className="truncate">{highlight.name}</div>
            <div className="text-pink-300 font-semibold">${Number(highlight.price || 0).toFixed(2)}</div>
          </div>
          <button
            onClick={() => onSelectProduct?.(highlight)}
            className="px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white"
          >
            View
          </button>
        </div>
      )}

      {recent.length > 0 && (
        <>
          <div className="text-sm text-white/80 mb-2">Recently viewed</div>
          <div className="grid grid-cols-4 gap-2">
            {recent.slice(0,4).map((p) => (
              <button key={p._id} onClick={() => onSelectProduct?.(p)} className="group">
                <img
                  src={p.imageURL}
                  alt={p.name}
                  className="h-14 w-full rounded-md object-cover border border-white/20 group-hover:border-white/40 transition"
                />
                <div className="mt-1 text-[11px] text-white/80 truncate">{p.name}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AppInner() {
  // API-driven state
  const [categoriesApi, setCategoriesApi] = useState([]); // [{_id, name}]
  const [activeCatId, setActiveCatId] = useState(null);

  const [products, setProducts] = useState([]);   // current page items
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 100;

  // UI state
  const [mainIdx, setMainIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const videoRef = useRef(null);

  // perf / motion
  const [reduceMotion, setReduceMotion] = useState(false);
  const [enableVideo, setEnableVideo] = useState(true);

  useEffect(() => {
    try {
      const lowMem = navigator.deviceMemory && navigator.deviceMemory <= 2;
      const fewCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
      const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (lowMem || fewCores || prefersReduced) setReduceMotion(true);
      if (lowMem || fewCores || prefersReduced) setEnableVideo(false);
    } catch {}
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play?.().catch(() => {});
  }, []);

  // Load categories once
  useEffect(() => {
    apiGet("/categories")
      .then((cats) => {
        setCategoriesApi(cats);
        if (!activeCatId && cats.length) setActiveCatId(cats[0]._id);
      })
      .catch(() => {});
  }, []);

  // Load products when category or page changes
  const fetchProducts = async (catId, p = 1) => {
    const qs = new URLSearchParams();
    if (catId) qs.set("categoryId", catId);
    qs.set("page", p);
    qs.set("limit", limit);
    const data = await apiGet(`/products?${qs.toString()}`);
    setProducts(data.items || []);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
    setPage(data.page || p);
    // reset hero index when category changes
    setMainIdx(0);
  };

  useEffect(() => {
    if (!activeCatId) return;
    fetchProducts(activeCatId, 1).catch(() => {});
  }, [activeCatId]);

  // Refetch when window regains focus AND when admin broadcasts db changes
  useEffect(() => {
    const onFocus = () => {
      if (activeCatId) fetchProducts(activeCatId, page).catch(()=>{});
    };
    const onDbChanged = () => {
      if (activeCatId) fetchProducts(activeCatId, page).catch(()=>{});
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener("db:changed", onDbChanged);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("db:changed", onDbChanged);
    };
  }, [activeCatId, page]);

  // map categories for header pills
  const visibleCats = categoriesApi.slice(0, 5).map(c => ({ id: c._id, name: c.name }));
  const overflowCats = categoriesApi.slice(5).map(c => ({ id: c._id, name: c.name }));

  // hero/main product from fetched list
  const mainProduct = products[mainIdx] || {};

  const handleNext = () => {
    setDirection(1);
    setMainIdx((p) => (p + 1) % Math.max(products.length, 1));
  };
  const handlePrev = () => {
    setDirection(-1);
    setMainIdx((p) => (p - 1 + Math.max(products.length, 1)) % Math.max(products.length, 1));
  };
  const handleCategoryChange = (catId) => {
    setActiveCatId(catId);
    setDirection(1);
    setShowDropdown(false);
  };

  // Helpers for Smart Picks persistence
  const pushRecent = (item) => {
    try {
      const recent = JSON.parse(localStorage.getItem("recentProducts") || "[]");
      const next = [item, ...recent.filter(x => x._id !== item._id)].slice(0, 8);
      localStorage.setItem("recentProducts", JSON.stringify(next));
    } catch {}
  };
  const getRecent = () => {
    try { return JSON.parse(localStorage.getItem("recentProducts") || "[]"); }
    catch { return []; }
  };

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden">
      {enableVideo && (
        <video
          ref={videoRef}
          className="pointer-events-none fixed inset-0 w-full h-full object-cover z-0"
          autoPlay muted loop playsInline preload="metadata"
        >
          <source src={bgVideo} type="video/webm" />
        </video>
      )}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 z-10" />

      <div className="w-full min-h-screen flex flex-col relative z-20 overflow-x-hidden">
        <Header
          categories={visibleCats}
          overflowCategories={overflowCats}
          selectedCat={activeCatId}
          onChangeCategory={handleCategoryChange}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenCart={() => setCartOpen(true)}
        />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

        <div className="w-full min-h-[80vh] grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 px-4 py-6">
          <div className="lg:col-span-2 min-w-0">
            <div className="w-full">
              <MainProduct
                mainProduct={{
                  name: mainProduct?.name,
                  price: mainProduct?.price,
                  description: mainProduct?.description,
                  image: mainProduct?.imageURL,   // backend field
                  rating: mainProduct?.rating,
                  freshness: mainProduct?.freshness
                }}
                handleNext={handleNext}
                handlePrev={handlePrev}
                reduceMotion={reduceMotion}
              />
              <ProductGrid
                title={`Trending Snacks (${products.length} of ${total || products.length})`}
                products={products.map(p => ({
                  id: p._id,           // unique key/id from DB
                  name: p.name,
                  image: p.imageURL,   // backend field
                  price: p.price,
                  rating: p.rating
                }))}
                mainIdx={mainIdx}
                setMainIdx={(idx) => {
                  setMainIdx(idx);
                  const item = products[idx];
                  if (item) pushRecent(item);
                }}
                setDirection={setDirection}
                isLoading={false}
                canLoadMore={false}
                reduceMotion={reduceMotion}
              />
            </div>
          </div>

          <div className="w-full">
            <Sidebar
              mainProduct={{
                name: mainProduct?.name,
                price: mainProduct?.price,
                description: mainProduct?.description,
                rating: mainProduct?.rating
              }}
            />
            {/* Smart Picks to fill the right-side space */}
            <SmartPicks
              onSelectProduct={(p) => {
                if (p?.categoryId) setActiveCatId(p.categoryId);
                setProducts((prev) => {
                  const filtered = (prev || []).filter(x => x._id !== p._id);
                  const next = [p, ...filtered];
                  setMainIdx(0);
                  return next;
                });
                pushRecent(p);
              }}
              recent={getRecent()}
              highlight={products[1] || products[0]}
            />
          </div>
        </div>
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(item) => {
          if (item?.categoryId) setActiveCatId(item.categoryId);
          setProducts((prev) => {
            const filtered = (prev || []).filter(p => p._id !== item._id);
            const next = [item, ...filtered];
            setMainIdx(0);
            return next;
          });
          pushRecent(item);
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
