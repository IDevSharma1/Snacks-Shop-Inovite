import React from 'react'

const CTAButton = ({ children, onClick }) => (
  <button 
    type="button" 
    onClick={onClick} 
    className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-coral to-[#ff8f70] text-white font-bold text-sm md:text-base hover:scale-105 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
  </button>
)

export default CTAButton
