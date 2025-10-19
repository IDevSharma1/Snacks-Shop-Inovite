import React from 'react'

const IconButton = ({ children, onClick, badge }) => (
  <button 
    onClick={onClick} 
    className="relative rounded-full bg-white w-10 h-10 md:w-12 md:h-12 grid place-items-center border border-black/5 hover:scale-110 hover:shadow-xl transition-all duration-300 hover:bg-coral hover:text-white group"
  >
    <span className="relative z-10 group-hover:scale-110 transition-transform">{children}</span>
    {badge > 0 && (
      <span className="absolute -top-1 -right-1 bg-coral text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
        {badge}
      </span>
    )}
  </button>
)

export default IconButton
