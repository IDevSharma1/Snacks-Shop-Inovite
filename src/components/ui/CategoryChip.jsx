import React from 'react'

const CategoryChip = ({ label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/80 backdrop-blur-lg text-xs md:text-sm font-semibold border-2 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 transform ${active ? 'chip-selected scale-110' : 'text-gray-600 hover:border-coral/30'}`}
  >
    {label}
  </button>
)

export default CategoryChip
