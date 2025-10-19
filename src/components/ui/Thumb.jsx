import React from 'react'

const Thumb = ({ src, className, onClick, style, size = 70, active }) => (
  <button
    onClick={onClick}
    style={{ width: `${size}px`, height: `${size}px`, ...style }}
    className={`rounded-full bg-white shadow-lg border-2 ${active ? 'border-coral ring-4 ring-coral/20 scale-110' : 'border-white/50'} ${className} transition-all duration-300 hover:scale-125 hover:shadow-2xl hover:border-coral overflow-hidden group`}
  >
    <img 
      src={src} 
      alt="thumb" 
      className="object-cover rounded-full group-hover:scale-110 transition-transform duration-300" 
      style={{ width: `${size - 16}px`, height: `${size - 16}px`, margin: '8px' }} 
    />
  </button>
)

export default Thumb
