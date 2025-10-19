import React from 'react'
import CategoryChip from '../ui/CategoryChip'
import IconButton from '../ui/IconButton'

const Header = ({ category, setCategory, setIndex, cart, setShowSearch, setShowReviews, setShowCart, scrolled }) => {
  return (
    <header className={`relative z-20 w-full px-4 md:px-6 py-4 md:py-6 flex items-center justify-between flex-wrap gap-4 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-2xl' : 'bg-transparent'}`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-coral to-[#ff8f70] bg-clip-text text-transparent font-heading animate-pulse">
          Snacks Shop
        </div>
        <span className="hidden md:block text-xs bg-coral text-white px-2 py-1 rounded-full font-bold animate-bounce">NEW</span>
      </div>
      
      <nav className="flex gap-2 md:gap-4 order-3 md:order-2 w-full md:w-auto justify-center">
        {['Salty','Sweet','Healthy','Drinks'].map((c) => (
          <CategoryChip key={c} label={c} active={category===c} onClick={() => { setCategory(c); setIndex(0); }} />
        ))}
      </nav>
      
      <div className="flex gap-3 md:gap-4 order-2 md:order-3">
        <IconButton onClick={() => setShowSearch(true)}>🔍</IconButton>
        <IconButton onClick={() => setShowReviews(true)}>⭐</IconButton>
        <IconButton onClick={() => setShowCart(true)} badge={cart.length}>🛒</IconButton>
      </div>
    </header>
  )
}

export default Header
