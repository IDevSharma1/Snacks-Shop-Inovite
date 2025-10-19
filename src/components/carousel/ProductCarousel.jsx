import React from 'react'
import Thumb from '../ui/Thumb'

const ProductCarousel = ({ items, index, setIndex, current }) => {
  return (
    <>
      {/* Desktop carousel */}
      <section className="relative hidden lg:block">
        <div className="relative w-[380px] xl:w-[480px] 2xl:w-[520px] h-[380px] xl:h-[480px] 2xl:h-[520px] mx-auto animate-float">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-white to-gray-100 shadow-2xl" />
          <div className="absolute inset-3 xl:inset-4 rounded-full border-[8px] xl:border-[10px] 2xl:border-[12px] border-dashed border-banana animate-spin-slow" />

          <img 
            src={current.image} 
            alt={current.name} 
            className="absolute inset-6 xl:inset-8 rounded-full object-cover w-[calc(100%-48px)] xl:w-[calc(100%-64px)] h-[calc(100%-48px)] xl:h-[calc(100%-64px)] shadow-2xl animate-scale-in" 
          />

          {/* thumbnails arranged in a perfect ring */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const containerSize = window.innerWidth >= 1536 ? 520 : window.innerWidth >= 1280 ? 480 : 380;
            const thumbSize = 70;
            const localCenter = containerSize / 2;
            const localRingRadius = localCenter - thumbSize / 2 - 8;
            const x = localCenter + localRingRadius * Math.cos(angle);
            const y = localCenter + localRingRadius * Math.sin(angle);
            const target = (index + i + 1) % items.length;
            return (
              <Thumb
                key={i}
                size={thumbSize}
                src={items[target].image}
                onClick={() => setIndex(target)}
                className="absolute animate-fade-in"
                style={{ 
                  left: `${x - thumbSize / 2}px`, 
                  top: `${y - thumbSize / 2}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            )
          })}

          {/* Larger arrows with modern styling */}
          <button 
            aria-label="Previous" 
            onClick={() => setIndex((index - 1 + items.length) % items.length)} 
            className="absolute top-1/2 -translate-y-1/2 -left-8 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-gradient-to-r from-coral to-[#ff8f70] text-white border-2 border-white hover:scale-110 transition-all duration-300 text-3xl xl:text-4xl font-bold shadow-2xl flex items-center justify-center hover:rotate-12"
          >
            ‹
          </button>
          <button 
            aria-label="Next" 
            onClick={() => setIndex((index + 1) % items.length)} 
            className="absolute top-1/2 -translate-y-1/2 -right-8 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-gradient-to-r from-coral to-[#ff8f70] text-white border-2 border-white hover:scale-110 transition-all duration-300 text-3xl xl:text-4xl font-bold shadow-2xl flex items-center justify-center hover:-rotate-12"
          >
            ›
          </button>
        </div>
      </section>

      {/* Mobile carousel with enhanced styling */}
      <section className="relative lg:hidden w-full max-w-sm mx-auto">
        <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mx-auto animate-float">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-2xl" />
          <div className="absolute inset-3 rounded-full border-[8px] border-dashed border-banana animate-spin-slow" />
          <img src={current.image} alt={current.name} className="absolute inset-6 rounded-full object-cover w-[calc(100%-48px)] h-[calc(100%-48px)] shadow-xl" />
          
          <button 
            aria-label="Previous" 
            onClick={() => setIndex((index - 1 + items.length) % items.length)} 
            className="absolute top-1/2 -translate-y-1/2 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-coral to-[#ff8f70] text-white border-2 border-white hover:scale-110 transition-all shadow-xl text-2xl font-bold"
          >
            ‹
          </button>
          <button 
            aria-label="Next" 
            onClick={() => setIndex((index + 1) % items.length)} 
            className="absolute top-1/2 -translate-y-1/2 -right-4 w-12 h-12 rounded-full bg-gradient-to-r from-coral to-[#ff8f70] text-white border-2 border-white hover:scale-110 transition-all shadow-xl text-2xl font-bold"
          >
            ›
          </button>
        </div>
      </section>
    </>
  )
}

export default ProductCarousel
