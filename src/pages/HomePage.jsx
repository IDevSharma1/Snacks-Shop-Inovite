import React, { useMemo, useState, useEffect } from 'react'
import VideoBackground from '../components/ui/VideoBackground'
import FloatingEmoji from '../components/ui/FloatingEmoji'
import Header from '../components/layout/Header'
import ProductInfo from '../components/product/ProductInfo'
import ProductCarousel from '../components/carousel/ProductCarousel'
import SearchModal from '../components/modals/SearchModal'
import ReviewsModal from '../components/modals/ReviewsModal'
import CartModal from '../components/modals/CartModal'
import Toast from '../components/ui/Toast'
import { datasets, reviews } from '../data/products'

const HomePage = () => {
  const memoizedDatasets = useMemo(() => datasets, [])

  const [category, setCategory] = useState('Salty')
  const items = memoizedDatasets[category]
  const [index, setIndex] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  const current = items[index]

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="h-screen flex flex-col relative">
      {/* Video Background Component */}
      <VideoBackground 
        src="https://www.pexels.com/download/video/2909914/" 
        overlay={0.4}
      />

      {/* Floating decorative elements */}
      <FloatingEmoji emoji="🍔" delay={0} />
      <FloatingEmoji emoji="🍕" delay={1} />
      <FloatingEmoji emoji="🍟" delay={2} />
      <FloatingEmoji emoji="🥤" delay={3} />

      {/* background shapes with animation */}
      <div className="pointer-events-none fixed -left-40 -top-40 w-[480px] h-[480px] rounded-full bg-banana opacity-50 blur-3xl animate-blob" />
      <div className="pointer-events-none fixed -right-32 bottom-[-140px] w-[420px] h-[420px] rounded-full bg-blush opacity-60 blur-3xl animate-blob animation-delay-2000" />
      <div className="pointer-events-none fixed top-1/2 left-1/2 w-[380px] h-[380px] rounded-full bg-coral opacity-30 blur-3xl animate-blob animation-delay-4000" />

      {/* Header */}
      <Header 
        category={category}
        setCategory={setCategory}
        setIndex={setIndex}
        cart={cart}
        setShowSearch={setShowSearch}
        setShowReviews={setShowReviews}
        setShowCart={setShowCart}
        scrolled={scrolled}
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full px-4 md:px-6 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">
          <ProductInfo 
            current={current}
            setCart={setCart}
            setToast={setToast}
            setShowCart={setShowCart}
          />

          <ProductCarousel 
            items={items}
            index={index}
            setIndex={setIndex}
            current={current}
          />
        </div>
      </main>

      {/* Modals */}
      <SearchModal showSearch={showSearch} setShowSearch={setShowSearch} />
      <ReviewsModal showReviews={showReviews} setShowReviews={setShowReviews} reviews={reviews} />
      <CartModal 
        showCart={showCart} 
        setShowCart={setShowCart} 
        cart={cart} 
        setCart={setCart} 
      />

      {/* Toast */}
      <Toast toast={toast} />
    </div>
  )
}

export default HomePage
