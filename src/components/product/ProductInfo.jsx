import React from 'react'
import FreshnessIndicator from '../ui/FreshnessIndicator'
import RatingStars from '../ui/RatingStars'
import CTAButton from '../ui/CTAButton'

const ProductInfo = ({ current, setCart, setToast, setShowCart }) => {
  return (
    <section className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left space-y-4">
      <FreshnessIndicator />
      
      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.05] font-extrabold text-white drop-shadow-2xl animate-fade-in">
        Feel-Good
      </h1>
      <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.05] font-extrabold bg-gradient-to-r from-coral via-[#ff8f70] to-banana bg-clip-text text-transparent mb-4 md:mb-6 animate-fade-in animation-delay-200">
        {current.name}
      </h2>
      
      <RatingStars rating={current.rating} />
      
      <p className="text-base md:text-lg text-white drop-shadow-lg mb-3 md:mb-4 bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/20">{current.description}</p>
      
      <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
        <div className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">${current.price.toFixed(2)}</div>
        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">20% OFF</span>
      </div>
      
      <div className="flex items-center justify-center lg:justify-start gap-6 flex-wrap">
        <CTAButton onClick={() => {
          setCart((c)=>[...c, { ...current, id: Date.now() }]);
          setToast(`🎉 ${current.name} added to cart`);
          setShowCart(true);
          setTimeout(()=>setToast(null), 2000);
        }}>
          🛒 ORDER NOW
        </CTAButton>
        
        <button className="flex items-center gap-2 text-white font-semibold hover:scale-105 transition-transform bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white/30">
          <span className="text-2xl">▶</span>
          Watch Story
        </button>
      </div>

      {/* Social Proof */}
      <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
        <div className="flex -space-x-2">
          {['👨', '👩', '🧑', '👴'].map((emoji, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-banana flex items-center justify-center text-xl border-2 border-white">
              {emoji}
            </div>
          ))}
        </div>
        <div className="text-white font-bold text-sm">
          <div className="text-2xl">1,500+</div>
          <div className="text-xs opacity-80">Happy Customers</div>
        </div>
      </div>
    </section>
  )
}

export default ProductInfo
